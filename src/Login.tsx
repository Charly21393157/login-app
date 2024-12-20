import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { logEvent } from "firebase/analytics";
import { trace } from "firebase/performance";
import { auth, analytics, performance } from "./firebaseConfig";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        const timestamp = new Date().toISOString(); // Para logs de timestamp
        const loginTrace = trace(performance, "login_flow_trace"); // Trace para el flujo del login
        loginTrace.start(); // Inicio del trace

        try {
            loginTrace.putAttribute("step", "started_login"); // Agregar atributo al trace
            console.log(`[Trace] Login Flow Trace Started at ${timestamp}`);

            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            // Logs: Registrar evento de inicio de sesión exitoso
            const logSuccess = {
                event: "login_success",
                email,
                timestamp,
                action: "User logged in successfully",
            };
            logEvent(analytics, "login_success", logSuccess);
            console.log("[Log] Login Successful Event:", logSuccess);

            // Métricas: Agregar un contador de éxito
            loginTrace.putMetric("success", 1);
            loginTrace.putAttribute("step", "login_successful");
            console.log(`[Metrics] Success Metric Recorded for ${email}`);

            console.log("Login successful:", userCredential);
            navigate("/home"); // Redirigir al usuario
        } catch (err: any) {
            // Logs: Registrar evento de error en el inicio de sesión
            const logError = {
                event: "login_error",
                email,
                timestamp,
                action: "Login attempt failed",
                error: err.message,
            };
            logEvent(analytics, "login_error", logError);
            console.error("[Log] Login Error Event:", logError);

            // Métricas: Agregar un contador de error
            loginTrace.putMetric("error", 1);
            loginTrace.putAttribute("step", "login_failed");
            console.error(`[Metrics] Error Metric Recorded for ${email}`);

            setError(err.message);
        } finally {
            loginTrace.stop(); // Finalizar el trace
            console.log(`[Trace] Login Flow Trace Stopped at ${new Date().toISOString()}`);
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
            <h2>Login</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", padding: "10px", margin: "10px 0" }}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", padding: "10px", margin: "10px 0" }}
            />
            <button
                onClick={handleLogin}
                style={{ padding: "10px 20px", marginTop: "10px", cursor: "pointer" }}
            >
                Login
            </button>
            {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        </div>
    );
};

export default Login;
