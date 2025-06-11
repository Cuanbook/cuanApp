import { EyeIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

export const Login = (): JSX.Element => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        alert("Login berhasil!");
        // Redirect ke halaman utama/dashboard
        navigate("/dashboard");
      } else {
        alert(data.message || "Login gagal");
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f9f9f9] min-h-screen flex flex-col justify-center items-center w-full">
      <div className="w-full max-w-[390px] min-h-[100dvh] px-4 py-8">
        <div className="relative w-full h-full">
          <div className="flex flex-col w-full h-full items-start">
            <div className="flex flex-col w-full h-full items-start justify-between">
              {/* Top section */}
              <div className="flex flex-col items-start w-full">
                {/* Logo */}
                <div className="flex items-center justify-center w-full gap-4 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col w-[21px] h-6 items-start">
                      <img
                        className="w-[22px] h-[25px] mb-[-1.00px] mr-[-1.00px] object-cover"
                        alt="CuanBook Logo"
                        src="/logoxuan-removebg-preview--1-.png"
                      />
                    </div>
                    <div className="inline-flex flex-col items-start">
                      <div className="font-bold text-[#111611] text-lg font-['Manrope',Helvetica] leading-[23px]">
                        CuanBook
                      </div>
                    </div>
                  </div>
                </div>

                {/* Welcome text */}
                <div className="flex flex-col items-center w-full mb-2">
                  <h1 className="font-bold text-[#0c141c] text-2xl text-center leading-[30px] font-['Inter',Helvetica]">
                    Selamat Datang Kembali
                  </h1>
                </div>

                {/* Subtitle */}
                <div className="flex flex-col items-center w-full mb-6">
                  <p className="font-normal text-[#0c141c] text-base text-center leading-6 font-['Inter',Helvetica]">
                    Silakan masukkan email dan kata sandi Anda untuk melanjutkan
                  </p>
                </div>

                <form onSubmit={handleLogin}>
                  {/* Email input */}
                  <div className="w-full mb-4">
                    <Card className="border-none w-full">
                      <CardContent className="p-0">
                        <Input
                          className="h-14 bg-[#ebf2e8] text-[#639154] border-none rounded-xl font-['Inter',Helvetica]"
                          placeholder="Email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                        />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Password input */}
                  <div className="w-full mb-6">
                    <div className="flex items-center w-full rounded-xl bg-[#ebf2e8]">
                      <Input
                        type="password"
                        className="h-14 flex-1 bg-transparent border-none text-[#639154] font-['Inter',Helvetica] rounded-l-xl"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                      />
                      <button type="button" className="px-4 h-14 flex items-center justify-center">
                        <EyeIcon className="w-[22px] h-[15px] text-gray-500" />
                      </button>
                    </div>
                  </div>

                  {/* Login button */}
                  <div className="w-full mb-4">
                    <Button type="submit" className="w-full h-12 bg-[#54d12b] hover:bg-[#4bc026] text-[#12190f] rounded-3xl font-bold shadow-[0px_4px_4px_#00000040] font-['Inter',Helvetica]" disabled={loading}>
                      {loading ? "Loading..." : "Login"}
                    </Button>
                  </div>
                </form>

                {/* Forgot password */}
                <div className="w-full text-center">
                  <p className="font-normal text-[#639154] text-sm leading-[21px] font-['Inter',Helvetica] cursor-pointer">
                    Lupa kata sandi?
                  </p>
                </div>
              </div>

              {/* Bottom section */}
              <div className="w-full mt-auto pt-8">
                <p 
                  onClick={() => navigate('/signup')}
                  className="font-normal text-[#609154] text-sm text-center leading-[21px] font-['Manrope',Helvetica] cursor-pointer"
                >
                  Belum punya akun? Daftar
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};