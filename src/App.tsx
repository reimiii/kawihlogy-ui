import { BrowserRouter, Route, Routes } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { JournalListByUser } from "./pages/JournalListByUser";
import { Profile } from "./pages/Profile";
import { AuthProvider } from "./context/AuthContext";
import { JournalDetail } from "./pages/JournalDetail";
import NotFound from "./errors/NotFound";
import JournalCreate from "./pages/JornalCreate";
import { ProtectedRoute } from "./components/ProtectedRoute";
import JournalUpdate from "./pages/JournalUpdate";

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route
                path="f/:userId/journals"
                element={<JournalListByUser />}
              />
              <Route path="*" element={<NotFound />} />

              <Route element={<ProtectedRoute />}>
                <Route path="p" element={<Profile />} />
                <Route path="journals/create" element={<JournalCreate />} />
                <Route path="journals/:uuid" element={<JournalDetail />} />
                <Route
                  path="journals/:uuid/update"
                  element={<JournalUpdate />}
                />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
