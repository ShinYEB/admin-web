import React, { useState } from 'react';
import Layout from '@/components/Layout/Layout';
import { GetServerSideProps } from 'next';
import Chatbot from "@/pages/custom/Chatbot";
import CustomDashboard from "@/pages/custom/CustomDashboard";

interface agentPageProps {

}

type Component = {
    type: string;
    props: any;
}

type CustomDashboardProps = {
    data: Component[];
}

const AgentPage: React.FC<agentPageProps> = ({}) => {

    const [customDashboard, setCustomDashboard] = useState<CustomDashboardProps>();

    return (
        <Layout title="에이전트 서비스 | Modive 관리자">
            <div style={{ display: 'flex', height: '90vh' }}>
                <div style={{ width: '40%' }}>
                    <Chatbot setComponents={setCustomDashboard}/>
                </div>
                <div style={{ width: '60%' }}>
                    <CustomDashboard data={customDashboard} />
                </div>
            </div>
        </Layout>
    )
}

export default AgentPage;
