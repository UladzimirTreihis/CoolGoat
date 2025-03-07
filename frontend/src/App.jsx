import './app.css'
import { Route, Routes } from 'react-router-dom'
import Login from './views/login/Login'
import Signup from './views/signup/Signup'
import Fixtures from './views/fixtures/Fixtures'
import FixtureDetail from './views/fixtureDetail/FixtureDetail'
import BondDetail from './views/bondDetail/BondDetail'
import Wallet from './views/wallet/Wallet'
import Recommendations from './views/recommendations/Recommendations'
import Bonds from './views/bonds/Bonds'
import { PublicOnlyRoute } from './auth/PublicOnlyRoute'
import { UserOnlyRoute } from './auth/UserOnlyRoute'
import { AdminOnlyRoute } from './auth/AdminOnlyRoute'
import Layout from './Layout'
import PurchaseOptions from './views/purchase/PurchaseOptions'
import WebpayCommit from './views/webpay/WebpayCommit'
import WebpayComplete from './views/webpay/WebpayComplete'
import AdminPage from './views/admin/AdminPage'

function App() {
  
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<UserOnlyRoute><Fixtures/></UserOnlyRoute>} />
          <Route path="/fixtures" element={<UserOnlyRoute><Fixtures/></UserOnlyRoute>} />
          <Route path="/fixtures/:id" element={<UserOnlyRoute><FixtureDetail/></UserOnlyRoute>} />
          <Route path="/wallet" element={<UserOnlyRoute><Wallet/></UserOnlyRoute>} />
          <Route path="/login" element={<PublicOnlyRoute><Login/></PublicOnlyRoute>} />
          <Route path="/signup" element={<PublicOnlyRoute><Signup/></PublicOnlyRoute>} />
          <Route path="/wallet/bond/:id" element={<UserOnlyRoute><BondDetail/></UserOnlyRoute>} />
          <Route path="/recommendations" element={<UserOnlyRoute><Recommendations/></UserOnlyRoute>} />
          <Route path="/bonds" element={<UserOnlyRoute><Bonds/></UserOnlyRoute>} />
          <Route path="/purchase/options" element={<UserOnlyRoute><PurchaseOptions /></UserOnlyRoute>} /> 
          <Route path="/webpay/commit" element={<UserOnlyRoute><WebpayCommit/></UserOnlyRoute>} />
          <Route path="/recommendations" element={<UserOnlyRoute><Recommendations></Recommendations></UserOnlyRoute>} />
          <Route path="/webpay/complete" element={<UserOnlyRoute><WebpayComplete/></UserOnlyRoute>} />
          <Route path="/bonds" element={<UserOnlyRoute><Bonds/></UserOnlyRoute>} />
          <Route path="/admin" element={<AdminOnlyRoute><AdminPage/></AdminOnlyRoute>} />
        </Routes>
      </Layout>
    </>
  )
}

export default App
