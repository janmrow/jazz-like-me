import { useEffect, useMemo, useState } from "react";

interface Album {
  id: string;
  artist: string;
  title: string;
  year: number;
  tags: string[];
}

interface RecommendationsResponse {
  recommendations: Album[];
}

interface TagsResponse {
  tags: string[];
}

export function App() {
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [recommendations, setRecommendations] = useState<Album[]>([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/tags")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load tags");
        }
        return response.json();
      })
      .then((data: TagsResponse) => {
        setTags(data.tags);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Something went wrong");
      })
      .finally(() => {
        setLoadingTags(false);
      });
  }, []);

  useEffect(() => {
    if (selectedTags.size === 0) {
      setRecommendations([]);
      return;
    }

    const query = Array.from(selectedTags).join(",");
    setLoadingRecommendations(true);
    setError(null);

    fetch(`/api/recommendations?tags=${encodeURIComponent(query)}`)
      .then(async (response) => {
        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body.error ?? "Failed to load recommendations");
        }
        return response.json();
      })
      .then((data: RecommendationsResponse) => {
        setRecommendations(data.recommendations);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setRecommendations([]);
      })
      .finally(() => {
        setLoadingRecommendations(false);
      });
  }, [selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((previous) => {
      const next = new Set(previous);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  };

  const tagButtons = useMemo(
    () =>
      tags.map((tag) => {
        const isSelected = selectedTags.has(tag);
        return (
          <button
            key={tag}
            type="button"
            role="checkbox"
            aria-checked={isSelected}
            aria-label={`${tag}${isSelected ? ", selected" : ""}`}
            onClick={() => toggleTag(tag)}
            className={`tag ${isSelected ? "tag--selected" : ""}`}
          >
            {tag}
          </button>
        );
      }),
    [tags, selectedTags]
  );

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">Jazz Like Me</h1>
        <p className="subtitle">Find three jazz albums that fit your mood.</p>
      </header>

      <main className="main">
        <section aria-labelledby="tags-heading" className="tags-section">
          <h2 id="tags-heading" className="section-title">
            How do you feel?
          </h2>
          {loadingTags ? (
            <p className="status">Loading tags…</p>
          ) : (
            <div className="tags" role="group" aria-label="Mood tags">
              {tagButtons}
            </div>
          )}
        </section>

        {error && (
          <div className="error" role="alert">
            {error}
          </div>
        )}

        <section
          aria-labelledby="recommendations-heading"
          className="recommendations-section"
        >
          <h2 id="recommendations-heading" className="section-title">
            {selectedTags.size === 0
              ? "Select a tag to begin"
              : "Three albums for you"}
          </h2>

          {loadingRecommendations ? (
            <p className="status">Finding albums…</p>
          ) : (
            <ul className="recommendations">
              {recommendations.map((album) => (
                <li key={album.id} className="album-card">
                  <h3 className="album-title">{album.title}</h3>
                  <p className="album-artist">{album.artist}</p>
                  <p className="album-year">{album.year}</p>
                  <div className="album-tags">
                    {album.tags.map((tag) => (
                      <span key={tag} className="album-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
