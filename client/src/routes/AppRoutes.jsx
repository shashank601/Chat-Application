export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Route>

      <Route
        path="/chat"
        element={
          <RequireAuth>
            <SocketProvider>
              <ChatAppLayout /> {/* This is the main layout with sidebar and outlet */}
            </SocketProvider>
          </RequireAuth>
        }
      >
       
        <Route index element={<Home />} />
        <Route path="room/:roomId" element={<ChatPanel />} />
      </Route>



      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}