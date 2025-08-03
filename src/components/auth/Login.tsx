import React, { useState } from "react";
import Logo from "/logo-removebg.png";
import GoogleSvg from "/icons8-google.svg";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [authState, setAuthState] = useState({
        user: null,
        isAuthenticated: false,
        isLoading: true,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const validate = () => {
        const newErrors: typeof errors = {};
        if (!formData.email) newErrors.email = "Email-ul este obligatoriu.";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email invalid.";
        if (!formData.password) newErrors.password = "Parola este obligatorie.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        // handle login logic here
        alert(`Logging in with email: ${formData.email}`);

        const userWithRole = {
            id: "1",
            name: "Admin User",
            email: formData.email,
            role: "ADMIN", // or "ADMIN", "LIBRARIAN" based on your logic
            createdAt: new Date().toISOString(),
        };

        setAuthState({
            user: userWithRole,
            isAuthenticated: true,
            isLoading: false,
        });
        navigate("/admin/dashboard", { replace: true });
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
            <div className="login-left hidden lg:flex flex-1 bg-blue-700 items-center justify-center">
                {/* Add an image or illustration here */}
                {/* <img src={YourImage} alt="Welcome Illustration" className="max-w-full max-h-full" /> */}
            </div>
            <div className="login-right flex flex-1 items-center justify-center p-8">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
                    <div className="mb-8 text-center">
                        <img src={Logo} alt="ArcGeodat Logo" className="mx-auto h-14 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900">Bun venit înapoi!</h2>
                        <p className="text-gray-600 mt-1">Te rugăm să introduci datele tale</p>
                    </div>
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="mb-5">
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition ${errors.email ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder="email@exemplu.com"
                                required
                            />
                            {errors.email && <p className="text-red-500 mt-1 text-sm">{errors.email}</p>}
                        </div>
                        <div className="mb-5 relative">
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                                Parola
                            </label>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition ${errors.password ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder="Introduce parola"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                aria-label={showPassword ? "Ascunde parola" : "Arată parola"}
                            >
                                {/* {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />} */}
                            </button>
                            {errors.password && <p className="text-red-500 mt-1 text-sm">{errors.password}</p>}
                        </div>

                        <div className="flex items-center justify-between mb-6">
                            <label className="inline-flex items-center space-x-2 text-gray-700">
                                <input
                                    type="checkbox"
                                    id="remember-me"
                                    className="form-checkbox h-4 w-4 text-blue-600"
                                />
                                <span>Ține-mă minte 30 de zile</span>
                            </label>
                            <a href="#" className="text-blue-600 hover:underline text-sm">
                                Ai uitat parola?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-700 hover:bg-blue-800 transition-colors text-white font-semibold py-3 rounded-xl shadow-md"
                        >
                            Autentificare
                        </button>

                        <div className="mt-6 flex items-center justify-center space-x-3">
                            <hr className="flex-grow border-gray-300" />
                            <span className="text-gray-400 text-sm font-medium">sau</span>
                            <hr className="flex-grow border-gray-300" />
                        </div>

                        <button
                            type="button"
                            className="mt-6 w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-3 hover:bg-gray-100 transition"
                        >
                            <img src={GoogleSvg} alt="Google Logo" className="h-5 w-5" />
                            Autentificare cu Google
                        </button>

                        {/* <p className="mt-8 text-center text-gray-600 text-sm">
                            Nu ai cont?{" "}
                            <a href="#" className="text-blue-600 hover:underline font-semibold">
                                Creează un cont
                            </a>
                        </p> */}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
function setAuthState(arg0: {
    user: {
        id: string; name: string; email: string; role: string; // or "ADMIN", "LIBRARIAN" based on your logic
        createdAt: string;
    }; isAuthenticated: boolean; isLoading: boolean;
}) {
    throw new Error("Function not implemented.");
}

