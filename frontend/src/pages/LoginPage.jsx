import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';

function LoginPage() {
  const { signIn, isAuthenticated, errors: signinErrors } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    signIn(data);
  });

  useEffect(() => {
    if (isAuthenticated) navigate('/ordenes');
  },

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-500 via-blue-600 to-blue-700">
      <nav className="bg-white py-4 absolute top-0 w-full">
        <div className="container mx-auto flex items-center justify-center">
          <h1 className="text-3xl font-extrabold text-blue-800">
            Soporte Técnico NetComputer - UNIR DevOps
          </h1>
        </div>
      </nav>
      <div className="bg-white max-w-md w-full p-10 rounded-md shadow-lg">
        {signinErrors?.map((err, i) => (
          <p key={i} className="text-red-500 my-2">
            {err}
          </p>
        ))}
        <h1 data-testid="login-title" className="text-3xl font-extrabold text-blue-800 mb-6">
          Iniciar Sesión
        </h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            {...register('username', { required: true })}
            className="w-full px-4 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 border"
            placeholder="DNI"
          />
          {errors?.email && <p className="text-red-500">E-mail requerido</p>}
          <input
            type="password"
            {...register('password', { required: true })}
            className="w-full px-4 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 border"
            placeholder="Contraseña"
          />
          {errors?.password && (
            <p className="text-red-500">Contraseña requerida</p>
          )}
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
