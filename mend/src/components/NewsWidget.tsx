import { useEffect, useState } from 'react';
import { fetchNews } from '../services/api';

interface NewsArticle {
  title: string;
  url: string;
}

export default function NewsWidget({ symbol }: { symbol: string }) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews(symbol)
      .then((data) => setArticles(data))
      .finally(() => setLoading(false));
  }, [symbol]);

  return (
    <div className="widget-card">
      <h2 className="widget-title">📈 Latest News for {symbol}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="news-list">
          {articles.slice(0, 5).map((article, i) => (
            <li key={i} className="news-item">
              <a href={article.url} target="_blank" rel="noreferrer">
                {article.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
