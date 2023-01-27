import { Link } from 'react-router-dom';

// material-ui
import { ButtonBase } from '@mui/material';

// project imports
import config from 'config';
import Logo from 'ui-component/Logo';
import { ReactComponent as LogoMain } from '../../../assets/logo/main-logo.svg';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => (
    <ButtonBase component={Link} to={config.defaultPath}>
        <LogoMain width="10px" height="10px" />
    </ButtonBase>
);

export default LogoSection;
