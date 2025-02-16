     
     import React, { useState } from 'react';
     import { register } from '../services/authService';

     const Register = () => {
       const [name, setName] = useState('');
       const [email, setEmail] = useState('');
       const [password, setPassword] = useState('');

       const handleSubmit = async (e) => {
         e.preventDefault();
         try {
           const response = await register({ name, email, password });
           alert(response.message);
         } catch (error) {
           alert('Erro ao registrar usuário');
         }
       };

       return (
         <form onSubmit={handleSubmit}>
           <h2>Registrar</h2>
           <input
             type="text"
             placeholder="Nome"
             value={name}
             onChange={(e) => setName(e.target.value)}
           />
           <input
             type="email"
             placeholder="Email"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
           />
           <input
             type="password"
             placeholder="Senha"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
           />
           <button type="submit">Registrar</button>
         </form>
       );
     };

     export default Register;

