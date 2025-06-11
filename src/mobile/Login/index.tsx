import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { getApiUrl } from '@/config/api';

export const Login = (): JSX.Element => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(getApiUrl("auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        toast.success("Login berhasil!");
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Login gagal");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between">
      {/* Logo Section */}
      <div className="flex items-center justify-center mt-8 mb-4">
        <div className="flex items-center gap-4">
          <img src="/logoxuan-removebg-preview--1-.png" alt="CuanBook Logo" className="w-[22px] h-[25px]" />
          <span className="font-manrope text-[18px] font-bold text-[#121712]">CuanBook</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-4">
        <div className="text-center mb-2">
          <h1 className="text-[24px] font-bold text-[#0D141C] mb-2">Selamat Datang Kembali</h1>
          <p className="text-[16px] text-[#0D141C] mb-6">
            Mohon masukkan email anda dan kata sandi untuk melanjutkan
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full h-[56px] bg-[#EBF2E8] text-[#639154] rounded-[12px] px-4"
              required
            />
          </div>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kata Sandi"
              className="w-full h-[56px] bg-[#EBF2E8] text-[#639154] rounded-[12px] pr-12 px-4"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#639154] hover:text-[#4b6e3f] transition-colors"
            >
              {showPassword ? (
                <EyeOffIcon className="h-6 w-6" />
              ) : (
                <EyeIcon className="h-6 w-6" />
              )}
            </button>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-[48px] bg-[#54D12B] hover:bg-[#4bc026] text-[#12190F] font-bold rounded-[24px] shadow-md"
          >
            {loading ? "Loading..." : "Masuk"}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-[14px] text-[#639154] hover:underline"
            >
              Lupa Kata Sandi?
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="text-center mb-8">
        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="text-[14px] text-[#619154] font-manrope"
        >
          Tidak Punya Akun? Daftar
        </button>
      </div>
    </div>
  );
};