import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";

import Login from "@/pages/Login";
import Intro from "@/pages/Intro";
import Interview from "@/pages/Interview";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({
children,
adminOnly = false,
}: {
children: React.ReactNode;
adminOnly?: boolean;
}) => {
const { user } = useAuth();

if (!user) return <Navigate to="/login" replace />;
if (adminOnly && user.role !== "admin") return <Navigate to="/intro" replace />;

return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
const { user } = useAuth();
if (user) return <Navigate to="/intro" replace />;
return <>{children}</>;
};

const App = () => (
<QueryClientProvider client={queryClient}>
<TooltipProvider>
<Toaster />
<Sonner />

<BrowserRouter>
<AuthProvider>
<Routes>
<Route path="/" element={<Navigate to="/login" replace />} />

<Route
path="/login"
element={
<PublicRoute>
<Login />
</PublicRoute>
}
/>

<Route
path="/intro"
element={
<ProtectedRoute>
<Intro />
</ProtectedRoute>
}
/>

<Route
path="/interview"
element={
<ProtectedRoute>
<Interview />
</ProtectedRoute>
}
/>

<Route
path="/admin"
element={
<ProtectedRoute adminOnly>
<Admin />
</ProtectedRoute>
}
/>

<Route path="*" element={<NotFound />} />
</Routes>
</AuthProvider>
</BrowserRouter>
</TooltipProvider>
</QueryClientProvider>
);

export default App;