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
    <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '300px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Вход в систему</h2>
        {nutrients_error && <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{nutrients_error}</div>}
        <form onSubmit={nutrients_handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="text" name="username" value={nutrients_formData.username} onChange={nutrients_handleChange} placeholder="Логин" style={{ padding: '10px', borderRadius: '10px', border: '1px solid #ccc' }} required disabled={isLoading} />
          <input type="password" name="password" value={nutrients_formData.password} onChange={nutrients_handleChange} placeholder="Пароль" style={{ padding: '10px', borderRadius: '10px', border: '1px solid #ccc' }} required disabled={isLoading} />
          <button type="submit" style={{ padding: '12px', borderRadius: '10px', background: '#259b23', color: 'white', border: 'none', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '45px' }} disabled={isLoading}>
            {isLoading ? <Spinner animation="border" size="sm" /> : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
};