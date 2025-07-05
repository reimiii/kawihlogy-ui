import { BrowserRouter, Route, Routes } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { JournalListByUser } from "./pages/JournalListByUser";
import { Profile } from "./pages/Profile";
import { AuthProvider } from "./context/AuthContext";

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
              <Route path="p" element={<Profile />} />
              <Route
                path="f/:userId/journals"
                element={<JournalListByUser />}
              />
              {/* <Route path="journal" element={<JournalList />} />
            <Route path="journal/create" element={<JournalCreate />} />
            <Route path="journal/:id" element={<JournalDetail />} />
            <Route path="journal/:id/edit" element={<JournalEdit />} /> */}
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
