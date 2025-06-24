import {LocationEdit, Brain, Gauge, NotebookPen, Network, ChartLine} from 'lucide-react'
import { DocumentType } from '@/types/index.d';

export const domeDocuments = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
]

export const nav_links = [
    {
        title: "home",
        href: "#home",
    },
    {
        title: "features",
        href: "#features",
    },
    {
        title: "pricing",
        href: "#pricing",
    },
    {
        title: "about",
        href: "#about",
    }
]

export const service_texts = [
    {
        title: 'Real-Time Co-Editing',
        desc: "Collaborate on document design, and projects with teammates as if you're all in the same room, with AI-powered suggestions that enhance your work.",
        Icon: LocationEdit,
        color: '#7bf1a8'
    },
    {
        title: "Intelligent Assistance",
        desc: "Get automated recommendations, insights, and content generation from AI to speed up decision-making and problem solving.",
        Icon: Brain,
        color: '#51a2ff'
    },
    {
        title: "Version Control & Speed",
        desc: "Keep track of every change and conversation. Our platform ensures you never lose important feedback and decisions.",
        Icon: Gauge,
        color: '#ff6467'
    },
    {
        title: `Smart Meeting Support`,
        desc: `AI-generated meetings notes, agendas, and summaries help you stay focused on what matters, making every meeting more productive.`,
        Icon: NotebookPen,
        color: '#51a2ff'
    },
    {
        title: `Seamless Integrations`,
        desc: `Easily integrate with tools you already use like Google Drive, Slack, and more, keeping your workflow uninterrupted.`,
        Icon: Network,
        color: '#ff6467'
    },
    {
        title: `Data Analysis & Visualization`,
        desc: `Let our AI help you analyze and visualize data in real-time, making complex data sets easy to understand and act upon.`,
        Icon: ChartLine,
        color: '#7bf1a8'
    }
]

export const systemContent = {
    role: "system",
    parts: [
        {
            text: `you are a helpful, polite, intelligent voice assistant. you assist with general knowledge, reasoning, creative task , and live search when needed.
            if the user asked something ambiguous. ask a clarifying question. keep your answer short and conversational when appropriate`
        }
    ]
}

export const MARKETING_URL = "/";

export const DASHBOARD_URL = "/dashboard";
export const DASHBOARD_DRAFTS_URL = `${DASHBOARD_URL}/drafts`;
export const DASHBOARD_GROUP_URL = (id: string) =>
    `${DASHBOARD_URL}/group/${id}`;

export const DOCUMENT_URL = (type: DocumentType, id: string) =>
    `/${type}/${id}`;