import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function UserData() {
  const { signUp, user, errors: registerErrors, updateUser } = useAuth();

  const userId = user.id
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      id: userId,
      ...values
    }
    const response = await updateUser(payload);
    console.log(response);
  });

  useEffect(() => {
    setValue('username', user.username);
    setValue('email', user.email);
  })

  return (
    <div className="bg-zinc-800 max-w-md p-10 rounded-md">
      {registerErrors.map((err, i) => (
        <p key={i} className="text-red-500">
          {err}
        </p>
      ))}
      <h1 className="text-2xl font-bold text-white">Personalizar Usuario</h1>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          {...register('username', { required: true })}
          className="w-full bg-zinc-700 text-white px-4 py-2 my-2 rounded-md"
          placeholder="Usuario"
        />
        {errors.username && <p className="text-red-500">Usuario requerido</p>}
        <input
          type="email"
          {...register('email', { required: true })}
          className="w-full bg-zinc-700 text-white px-4 py-2 my-2 rounded-md"
          placeholder="E-mail"
        />
        {errors.email && <p className="text-red-500">E-mail requerido</p>}
        <input
          type="password"
          {...register('password', { required: true, minLength: 6 })}
          className="w-full bg-zinc-700 text-white px-4 py-2 my-2 rounded-md"
          placeholder="Nueva Contraseña"
        />
        {errors.password && (
          <p className="text-red-500">Contraseña inválida (min 6 caracteres)</p>
        )}
        <button
          type="submit"
          className="border border-sky-500 bg-sky-500 text-white px-4 py-2 my-2 rounded-md"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}

export { UserData };
