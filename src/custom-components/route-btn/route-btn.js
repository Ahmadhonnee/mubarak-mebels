import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

export const RouteBtn = ({ to, ...props }) => {
    const navigate = useNavigate();
    if (to === 'goBack') {
        return (
            <Button
                onClick={() => {
                    navigate(-1);
                }}
                {...props}
            />
        );
    }
    return (
        // <Link
        //     to={to}
        //     style={{
        //         textDecoration: 'none',
        //     }}
        // >
        <Button
            onClick={() => {
                navigate(to);
            }}
            {...props}
        />
        // {/* </Link> */}
    );
};
