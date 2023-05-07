import { useState, type FormEvent, type FC } from "react";
import axios, { AxiosError } from "axios";
import { Copy, ExternalLink } from "lucide-react";

interface ShortenResponse {
  shortCode?: string;
  error?: string;
}

interface ApiErrorResponse {
  error: string;
}

const App: FC = () => {
  const [url, setUrl] = useState<string>("");
  const [shortCode, setShortCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const API_BASE_URL = "https://url-shortener-h6l6.onrender.com";

  const handleShorten = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setError("");
    setShortCode("");

    if (!url.trim()) {
      setError("Enter a URL");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post<ShortenResponse>(
        `${API_BASE_URL}/api/shorten`,
        { url },
      );

      if (res.data.error) {
        setError(res.data.error);
      } else if (res.data.shortCode) {
        setShortCode(res.data.shortCode);
        setUrl("");
      }
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setError(axiosError.response?.data?.error ?? "Error shortening URL");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (): Promise<void> => {
    if (!shortCode) return;
    await navigator.clipboard.writeText(`${API_BASE_URL}/${shortCode}`);
    alert("Copied!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-l from-[#1A181B] via-[#281a45] to-[#322E33] flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">URL Shortener</h1>
          <p className="text-white text-lg opacity-80">
            Make links short & shareable
          </p>
        </div>

        <div className="bg-violet-100 rounded-xl border border-zinc-100">
          <div className="bg-gradient-to-r from-[#302039] to-[#560056] p-6 rounded-t-xl opacity-90">
            <h2 className="text-xl font-bold text-white/70">
              Create Short URL
            </h2>
          </div>

          <div className="p-8">
            <form onSubmit={handleShorten} className="space-y-4">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
                placeholder="https://example.com/very/long/url"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
              />

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-red-700 font-semibold">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#4e104e] to-[#1A181B] hover:from-[#5f145f] hover:to-[#262326] text-white text-lg py-3 rounded-lg font-medium hover:shadow-lg disabled:opacity-50 transition-colors duration-200"
              >
                {loading ? "Shortening..." : "Shorten URL"}
              </button>
            </form>

            {shortCode && (
              <div className="mt-8 pt-8 border-t-2 border-gray-200">
                <div className="bg-green-50 p-6 rounded-lg border-2 border-green-300">
                  <p className="text-sm text-green-600 font-bold uppercase mb-3">
                    Your Short URL
                  </p>

                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      readOnly
                      value={`${API_BASE_URL}/${shortCode}`}
                      className="flex-1 px-4 py-2 bg-white border-2 border-green-300 rounded font-mono text-green-900 font-bold"
                    />

                    <button
                      onClick={handleCopy}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-semibold flex items-center gap-2"
                    >
                      <Copy size={18} /> Copy
                    </button>
                  </div>

                  <a
                    href={`${API_BASE_URL}/${shortCode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-2 bg-gradient-to-r from-[#4e104e] to-[#1A181B] hover:from-[#5f145f] hover:to-[#262326] text-white rounded transition font-semibold flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={18} /> Visit
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-blue-100 mt-8">Secure • Fast • Simple</p>
      </div>
    </div>
  );
};

export default App;
