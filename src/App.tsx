import { useWindowTitle } from './hooks';
import 'antd/dist/antd.css';
import './index.css';
import { Layout } from 'antd';
import { BrowserRouter as Router } from 'react-router-dom';
import { user as userState } from './contexts';
import { Header } from './shared/Header';
import { AppRouter } from './AppRouter';

const { Content } = Layout;

const App = () => {
  useWindowTitle();

  return (
    <Router>
      <userState.UserContextProvider>
        <Layout>
          <Header />
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              height: '100vh',
              overflow: 'auto',
            }}
          >
            <Layout>
              <Layout style={{ padding: '0 24px 24px' }}>
                <Content
                  className="site-layout-background"
                  style={{
                    padding: 24,
                    margin: 0,
                    minHeight: 280,
                  }}
                >
                  <AppRouter />
                </Content>
              </Layout>
            </Layout>
          </Content>
        </Layout>
      </userState.UserContextProvider>
    </Router>
  );
};

export default App;
