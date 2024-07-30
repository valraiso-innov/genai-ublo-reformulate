"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import * as Api from "@/services/login-api";

type Login = {
  username: string,
  password: string,
};

function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<Login>();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async ({ username, password }: Login) => {
    const token = `${username}|${password}`;
    const success = await Api.login(token);
    if (success) {
      sessionStorage.setItem('token', token);
      router.push("/");
    } else {
      setServerError("Nom d'utilisateur ou mot de passe invalide. Veuillez réessayer.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Se connecter</h2>
        <div className="mb-4">
          <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700">Nom d&apos;utilisateur</label>
          <input
            type="text"
            id="username"
            placeholder="Nom d'utilisateur"
            {...register("username", { required: "Username is required" })}
            className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${errors.username ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
          />
          {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Mot de passe</label>
          <input
            type="password"
            id="password"
            placeholder="Mot de passe"
            {...register("password", { required: "Password is required" })}
            className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>
        {serverError && <p className="mb-4 text-sm text-center text-red-600">{serverError}</p>}
        <button
          type="submit"
          className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Soumettre
        </button>
      </form>
    </div>
  );
}

export default LoginPage;