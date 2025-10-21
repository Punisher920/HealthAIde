import Layout from "./Layout.jsx";

import Home from "./Home";

import Chat from "./Chat";

import Store from "./Store";

import ProductVetting from "./ProductVetting";

import Blog from "./Blog";

import Contact from "./Contact";

import AffiliateDashboard from "./AffiliateDashboard";

import AdminDashboard from "./AdminDashboard";

import Profile from "./Profile";

import AIInsights from "./AIInsights";

import RootAgent from "./RootAgent";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    Chat: Chat,
    
    Store: Store,
    
    ProductVetting: ProductVetting,
    
    Blog: Blog,
    
    Contact: Contact,
    
    AffiliateDashboard: AffiliateDashboard,
    
    AdminDashboard: AdminDashboard,
    
    Profile: Profile,
    
    AIInsights: AIInsights,
    
    RootAgent: RootAgent,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Chat" element={<Chat />} />
                
                <Route path="/Store" element={<Store />} />
                
                <Route path="/ProductVetting" element={<ProductVetting />} />
                
                <Route path="/Blog" element={<Blog />} />
                
                <Route path="/Contact" element={<Contact />} />
                
                <Route path="/AffiliateDashboard" element={<AffiliateDashboard />} />
                
                <Route path="/AdminDashboard" element={<AdminDashboard />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/AIInsights" element={<AIInsights />} />
                
                <Route path="/RootAgent" element={<RootAgent />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}