import SuggestionsCarousel from '../components/SuggestionsCarousel'

export default function Suggestions({ onFileClick, apps, onSuggestionClick }) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <SuggestionsCarousel 
        isMobile={true} 
        apps={apps}
        onSuggestionClick={onSuggestionClick}
      />
    </div>
  )
}
