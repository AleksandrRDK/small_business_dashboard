import AppRoutes from '../../routes/AppRoutes';
import "../../styles/responsive.scss";

const App: React.FC = () => {
    return (
        <div className="container">
            <AppRoutes />
        </div>
    );
};

export default App;