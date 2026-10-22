import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, X, Check, Sparkles, Tag } from 'lucide-react';

export const SKILL_CATALOGUE = [
  // Programming Languages
  { name: 'Python', category: 'Programming Languages' },
  { name: 'JavaScript', category: 'Programming Languages' },
  { name: 'TypeScript', category: 'Programming Languages' },
  { name: 'SQL', category: 'Programming Languages' },
  { name: 'Java', category: 'Programming Languages' },
  { name: 'C++', category: 'Programming Languages' },
  { name: 'C#', category: 'Programming Languages' },
  { name: 'Go', category: 'Programming Languages' },
  { name: 'Rust', category: 'Programming Languages' },
  { name: 'Ruby', category: 'Programming Languages' },
  { name: 'PHP', category: 'Programming Languages' },
  { name: 'Kotlin', category: 'Programming Languages' },
  { name: 'Swift', category: 'Programming Languages' },
  { name: 'HTML5', category: 'Programming Languages' },
  { name: 'CSS3', category: 'Programming Languages' },
  { name: 'Bash/Shell', category: 'Programming Languages' },

  // Frontend Development
  { name: 'React', category: 'Frontend Development' },
  { name: 'React Native', category: 'Frontend Development' },
  { name: 'Next.js', category: 'Frontend Development' },
  { name: 'Vue.js', category: 'Frontend Development' },
  { name: 'Nuxt.js', category: 'Frontend Development' },
  { name: 'Angular', category: 'Frontend Development' },
  { name: 'Svelte', category: 'Frontend Development' },
  { name: 'Tailwind CSS', category: 'Frontend Development' },
  { name: 'Redux Toolkit', category: 'Frontend Development' },
  { name: 'Vite', category: 'Frontend Development' },

  // Backend Development
  { name: 'FastAPI', category: 'Backend Development' },
  { name: 'Node.js', category: 'Backend Development' },
  { name: 'Express.js', category: 'Backend Development' },
  { name: 'Django', category: 'Backend Development' },
  { name: 'Flask', category: 'Backend Development' },
  { name: 'Spring Boot', category: 'Backend Development' },
  { name: 'NestJS', category: 'Backend Development' },
  { name: 'ASP.NET Core', category: 'Backend Development' },
  { name: 'GraphQL', category: 'Backend Development' },
  { name: 'REST APIs', category: 'Backend Development' },
  { name: 'Microservices', category: 'Backend Development' },

  // Databases
  { name: 'PostgreSQL', category: 'Databases' },
  { name: 'MySQL', category: 'Databases' },
  { name: 'MongoDB', category: 'Databases' },
  { name: 'Redis', category: 'Databases' },
  { name: 'SQLite', category: 'Databases' },
  { name: 'Elasticsearch', category: 'Databases' },
  { name: 'DynamoDB', category: 'Databases' },
  { name: 'Supabase', category: 'Databases' },
  { name: 'Prisma ORM', category: 'Databases' },
  { name: 'SQLAlchemy', category: 'Databases' },

  // Cloud & DevOps
  { name: 'Docker', category: 'Cloud & DevOps' },
  { name: 'Kubernetes', category: 'Cloud & DevOps' },
  { name: 'AWS (Amazon Web Services)', category: 'Cloud & DevOps' },
  { name: 'Microsoft Azure', category: 'Cloud & DevOps' },
  { name: 'Google Cloud Platform (GCP)', category: 'Cloud & DevOps' },
  { name: 'Terraform', category: 'Cloud & DevOps' },
  { name: 'CI/CD Pipelines', category: 'Cloud & DevOps' },
  { name: 'GitHub Actions', category: 'Cloud & DevOps' },
  { name: 'Linux Administration', category: 'Cloud & DevOps' },
  { name: 'Nginx', category: 'Cloud & DevOps' },

  // Testing & Automation
  { name: 'Pytest', category: 'Testing & Automation' },
  { name: 'Jest', category: 'Testing & Automation' },
  { name: 'Cypress', category: 'Testing & Automation' },
  { name: 'Playwright', category: 'Testing & Automation' },
  { name: 'Selenium', category: 'Testing & Automation' },
  { name: 'Postman', category: 'Testing & Automation' },

  // Data Science & AI
  { name: 'Machine Learning', category: 'Data Science & AI' },
  { name: 'Deep Learning', category: 'Data Science & AI' },
  { name: 'PyTorch', category: 'Data Science & AI' },
  { name: 'TensorFlow', category: 'Data Science & AI' },
  { name: 'Pandas', category: 'Data Science & AI' },
  { name: 'NumPy', category: 'Data Science & AI' },
  { name: 'LangChain', category: 'Data Science & AI' },
  { name: 'Natural Language Processing', category: 'Data Science & AI' },

  // Tools & Platforms
  { name: 'Git', category: 'Tools & Platforms' },
  { name: 'GitHub', category: 'Tools & Platforms' },
  { name: 'GitLab', category: 'Tools & Platforms' },
  { name: 'VS Code', category: 'Tools & Platforms' },
  { name: 'Jira', category: 'Tools & Platforms' },
  { name: 'Figma', category: 'Tools & Platforms' },

  // Soft Skills
  { name: 'Agile & Scrum', category: 'Soft Skills' },
  { name: 'Team Leadership', category: 'Soft Skills' },
  { name: 'Problem Solving', category: 'Soft Skills' },
  { name: 'Communication', category: 'Soft Skills' },
  { name: 'Cross-functional Collaboration', category: 'Soft Skills' }
];

export default function SkillAutocomplete({
  selectedSkills = [],
  onAddSkill,
  onRemoveSkill,
  placeholder = "Type to search skills (e.g. py, rea, sql)..."
}) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Filter & rank suggestions
  const suggestions = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const existingNames = new Set(selectedSkills.map(s => (s.name || s).toLowerCase()));

    const matches = SKILL_CATALOGUE.filter(item => {
      if (existingNames.has(item.name.toLowerCase())) return false;
      return item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
    });

    // Rank: exact match > prefix match > word match > substring
    matches.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      if (aName === q) return -1;
      if (bName === q) return 1;
      const aStarts = aName.startsWith(q);
      const bStarts = bName.startsWith(q);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return aName.localeCompare(bName);
    });

    return matches.slice(0, 10);
  }, [query, selectedSkills]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [suggestions]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (skillItem) => {
    const exists = selectedSkills.some(s => (s.name || s).toLowerCase() === skillItem.name.toLowerCase());
    if (exists) return;

    onAddSkill({
      name: skillItem.name,
      category: skillItem.category || 'Technical',
      proficiency: 'Intermediate'
    });
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleAddCustom = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const exists = selectedSkills.some(s => (s.name || s).toLowerCase() === trimmed.toLowerCase());
    if (!exists) {
      onAddSkill({
        name: trimmed,
        category: 'Custom',
        proficiency: 'Intermediate'
      });
    }
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      setHighlightedIndex(prev => (prev + 1) % (suggestions.length + (query ? 1 : 0)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev <= 0 ? suggestions.length : prev - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0 && highlightedIndex < suggestions.length) {
        handleSelect(suggestions[highlightedIndex]);
      } else if (query.trim()) {
        handleAddCustom();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {/* Search Input Box */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: '#0f172a',
        border: '1px solid #334155',
        borderRadius: '8px',
        padding: '8px 12px',
        gap: '8px',
        transition: 'border-color 0.2s, box-shadow 0.2s'
      }}>
        <Search size={16} style={{ color: '#94a3b8', flexShrink: 0 }} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#f8fafc',
            fontSize: '14px',
            width: '100%'
          }}
          aria-autocomplete="list"
          aria-expanded={isOpen && (suggestions.length > 0 || !!query.trim())}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (suggestions.length > 0 || query.trim()) && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          right: 0,
          background: '#1e293b',
          border: '1px solid #475569',
          borderRadius: '8px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4)',
          zIndex: 1000,
          maxHeight: '280px',
          overflowY: 'auto',
          padding: '6px'
        }}>
          {suggestions.map((item, idx) => {
            const isHighlighted = idx === highlightedIndex;
            return (
              <div
                key={item.name}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setHighlightedIndex(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: isHighlighted ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                  color: isHighlighted ? '#ffffff' : '#e2e8f0',
                  cursor: 'pointer',
                  fontSize: '13px',
                  transition: 'background 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 600 }}>{item.name}</span>
                </div>
                <span style={{
                  fontSize: '11px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: '#0f172a',
                  color: '#94a3b8'
                }}>
                  {item.category}
                </span>
              </div>
            );
          })}

          {/* Option to add custom skill */}
          {query.trim() && !suggestions.some(s => s.name.toLowerCase() === query.trim().toLowerCase()) && (
            <div
              onClick={handleAddCustom}
              onMouseEnter={() => setHighlightedIndex(suggestions.length)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '6px',
                background: highlightedIndex === suggestions.length ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                color: '#818cf8',
                cursor: 'pointer',
                fontSize: '13px',
                borderTop: suggestions.length > 0 ? '1px solid #334155' : 'none',
                marginTop: suggestions.length > 0 ? '4px' : 0
              }}
            >
              <Plus size={14} />
              <span>Add custom skill: <strong>"{query.trim()}"</strong></span>
            </div>
          )}
        </div>
      )}

      {/* Selected Skill Chips List */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
        {selectedSkills.map((skill) => {
          const name = skill.name || skill;
          const id = skill.id;
          return (
            <span
              key={id || name}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#c7d2fe',
                border: '1px solid rgba(99, 102, 241, 0.35)',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 500
              }}
            >
              <Tag size={12} style={{ color: '#818cf8' }} />
              <span>{name}</span>
              <button
                type="button"
                onClick={() => onRemoveSkill(skill)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Remove skill"
              >
                <X size={13} style={{ hover: { color: '#ef4444' } }} />
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
}
