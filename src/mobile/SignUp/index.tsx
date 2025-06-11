import React, { useState } from "react";
import { ArrowLeft, EyeIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

export const SignUp = (): JSX.Element => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Konfirmasi password tidak cocok");
      return;
    }
    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Gagal daftar");
        return;
      }
      navigate("/login");
    } catch (err) {
      setError("Terjadi kesalahan jaringan");
    }
  };

  return (
    <div className="bg-[#f9f9f9] min-h-screen flex flex-col justify-center items-center w-full">
      <div className="w-full max-w-[390px] min-h-[100dvh] px-4 py-8">
        <form onSubmit={handleSignUp}>
          <div className="relative w-full h-full">
            <div className="flex flex-col w-full h-full items-start">
              {/* Header with back button and title */}
              <div className="flex items-center w-full mb-8 relative">
                <button
                  onClick={() => navigate("/")}
                  className="absolute left-0 p-2"
                >
                  <ArrowLeft className="w-6 h-6 text-[#111611]" />
                </button>
                <div className="flex-1 text-center">
                  <h1 className="font-bold text-[#111611] text-lg font-['Manrope',Helvetica]">
                    Daftar
                  </h1>
                </div>
              </div>

              {/* Email input */}
              <div className="w-full mb-4">
                <Card className="border-none w-full">
                  <CardContent className="p-0">
                    <Input
                      className="h-14 bg-[#ebf2e8] text-[#639154] border-none rounded-xl font-['Inter',Helvetica]"
                      placeholder="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Password input */}
              <div className="w-full mb-4">
                <div className="flex items-center w-full rounded-xl bg-[#ebf2e8]">
                  <Input
                    type="password"
                    className="h-14 flex-1 bg-transparent border-none text-[#639154] font-['Inter',Helvetica] rounded-l-xl"
                    placeholder="Kata Sandi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button className="px-4 h-14 flex items-center justify-center">
                    <EyeIcon className="w-[22px] h-[15px] text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Confirm Password input */}
              <div className="w-full mb-6">
                <div className="flex items-center w-full rounded-xl bg-[#ebf2e8]">
                  <Input
                    type="password"
                    className="h-14 flex-1 bg-transparent border-none text-[#639154] font-['Inter',Helvetica] rounded-l-xl"
                    placeholder="Konfirmasi Kata Sandi"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                  <button className="px-4 h-14 flex items-center justify-center">
                    <EyeIcon className="w-[22px] h-[15px] text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Sign Up button */}
              <div className="w-full mb-4">
                <Button
                  type="submit"
                  className="w-full h-12 bg-[#54d12b] hover:bg-[#4bc026] text-[#12190f] rounded-3xl font-bold shadow-[0px_4px_4px_#00000040] font-['Inter',Helvetica]"
                >
                  Daftar
                </Button>
              </div>
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

              {/* Terms text */}
              <div className="w-full text-center mb-4">
                <p className="font-normal text-[#639154] text-xs leading-[18px] font-['Inter',Helvetica]">
                  Dengan mendaftar, Anda setuju dengan{" "}
                  <span className="text-[#54d12b] cursor-pointer">
                    Syarat & Ketentuan
                  </span>
                  {" "}dan{" "}
                  <span className="text-[#54d12b] cursor-pointer">
                    Kebijakan Privasi
                  </span>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};