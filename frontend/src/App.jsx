import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import TransactionPage from "./pages/TransactionPage";
import NotFoundPage from "./pages/NotFoundPage";
import Header from "./components/ui/Header";
import { useQuery } from "@apollo/client";
import { GET_AUTHENTICATED_USER } from "./graphql/queries/user.query";
import { Toaster } from "react-hot-toast";
function App() {
  const { loading, data, error } = useQuery(GET_AUTHENTICATED_USER);

  if (loading) return <p>Loading...</p>; // Show a loading message while fetching data
  if (error) return <p>Error loading user data</p>; // Handle error gracefully

  const isAuthenticated = !!data?.authUser; // Check if authUser exists

  return (
    <>
      {isAuthenticated && <Header />}
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <HomePage /> : <Navigate to="/signup" />}
        ></Route>
        <Route
          path="/signup"
          element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/transaction/:id"
          element={isAuthenticated ? <TransactionPage /> : <Navigate to="/login" />}
        ></Route>
        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;

