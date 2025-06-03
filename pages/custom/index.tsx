import React, { useState } from 'react';
import Layout from '@/components/Layout/Layout';
import { GetServerSideProps } from 'next';
import Chatbot from "@/pages/custom/Chatbot";


interface agentPageProps {

}

const AgentPage: React.FC<agentPageProps> = ({}) => {

    return (
        <Layout title="에이전트 서비스 | Modive 관리자">
            <div style={{ display: 'flex' }}>
                <div style={{ width: '50%' }}>
                    <Chatbot/>
                </div>
                <div style={{ width: '50%' }}>
                    fs
                </div>
            </div>
        </Layout>
    )
}

export default AgentPage;