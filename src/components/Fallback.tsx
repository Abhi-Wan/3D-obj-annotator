import { useNavigate } from "react-router";
import './Fallback.css';

export function Fallback({ message }: { message: string}) {
    const navigate = useNavigate();

    return (
      <div className='fallback-container'>
        <h3>{message}</h3>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    )
}