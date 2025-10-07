'use client'

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, ExternalLink, Github, Loader2 } from 'lucide-react';

interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  stargazers_count: number;
  description: string;
  html_url: string;
  language: string;
}

interface GitHubResponse {
  items: Repository[];
  total_count: number;
}

export default function RepositoryExplorer() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const perPage = 30;

  const fetchRepos = async (pageNum: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=stars:>5000&sort=stars&order=desc&per_page=${perPage}&page=${pageNum}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }
      
      const data: GitHubResponse = await response.json();
      setRepos(data.items);
      setTotalCount(data.total_count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos(page);
  }, [page]);

  const totalPages = Math.min(Math.ceil(totalCount / perPage), 34);

  const formatStarCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Github className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              GitHub Repository Explorer
            </h1>
          </div>
          <p className="mt-2 text-gray-400 text-sm sm:text-base">
            Discover popular repositories with 5000+ stars
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 text-center">
            <p className="text-red-400 text-lg">{error}</p>
            <button
              onClick={() => fetchRepos(page)}
              className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid gap-6 mb-8">
              {repos.map((repo) => (
                <div
                  key={repo.id}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/10"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <img
                      src={repo.owner.avatar_url}
                      alt={repo.owner.login}
                      className="w-16 h-16 rounded-lg flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <h2 className="text-xl font-semibold text-white truncate">
                          {repo.name}
                        </h2>
                        <div className="flex items-center gap-1 text-yellow-400 flex-shrink-0">
                          <Star className="w-5 h-5 fill-current" />
                          <span className="font-semibold">
                            {formatStarCount(repo.stargazers_count)}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-400 text-sm mb-3">
                        by <span className="text-blue-400">{repo.owner.login}</span>
                      </p>

                      <p className="text-gray-300 mb-4 line-clamp-2">
                        {repo.description || 'No description available'}
                      </p>

                      <div className="flex flex-wrap items-center gap-3">
                        {repo.language && (
                          <span className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm">
                            {repo.language}
                          </span>
                        )}
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                        >
                          View on GitHub
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
              <div className="text-gray-400 text-sm">
                Page <span className="text-white font-semibold">{page}</span> of{' '}
                <span className="text-white font-semibold">{totalPages}</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-700"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}