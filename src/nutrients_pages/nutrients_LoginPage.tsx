import { type FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import type { AppDispatch, RootState } from '../nutrients_store';
import { nutrients_loginSuccess, nutrients_loginFailure } from '../nutrients_store/nutrients_userSlice';
import { nutrients_fetchList } from '../nutrients_store/nutrients_listSlice';
import { nutrients_fetchDraft } from '../nutrients_store/nutrients_draftSlice';
import { NUTRIENTS_ROUTES } from '../nutrients_Routes';

export const Nutrients_LoginPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const nutrients_error = useSelector((state: RootState) => state.nutrients_user.nutrients_error);

  const [nutrients_formData, nutrients_setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const nutrients_handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    nutrients_setFormData({ ...nutrients_formData, [e.target.name]: e.target.value });
  };

  const nutrients_handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nutrients_formData.username && nutrients_formData.password) {
      setIsLoading(true);
      try {
        const response = await axios.post('/api/users/login', nutrients_formData, { baseURL: '/', withCredentials: true });
        
        const username = response.data?.user?.username || nutrients_formData.username;
        dispatch(nutrients_loginSuccess(username));
        
        await dispatch(nutrients_fetchDraft()); 
        await dispatch(nutrients_fetchList());
        
        // Редирект на плитку
        navigate(NUTRIENTS_ROUTES.NUTRIENTS_GRID);
      } catch (error: any) {
        dispatch(nutrients_loginFailure('Ошибка авторизации. Проверьте логин и пароль.'));
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="login-screen-wrapper">
      <div className="login-container">
        <h2 className="login-title">Вход в систему</h2>
        
        {nutrients_error && <div className="login-error">{nutrients_error}</div>}
        
        <form onSubmit={nutrients_handleSubmit} className="login-form">
          <input 
            type="text" 
            name="username" 
            value={nutrients_formData.username} 
            onChange={nutrients_handleChange} 
            placeholder="Логин" 
            className="login-input" 
            required 
            disabled={isLoading} 
          />
          
          <input 
            type="password" 
            name="password" 
            value={nutrients_formData.password} 
            onChange={nutrients_handleChange} 
            placeholder="Пароль" 
            className="login-input" 
            required 
            disabled={isLoading} 
          />
          
          <button type="submit" className="login-submit-btn" disabled={isLoading}>
            {isLoading ? <Spinner animation="border" size="sm" /> : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
};