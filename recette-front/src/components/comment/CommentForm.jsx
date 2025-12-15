import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';

const CommentForm = ({ onSubmit }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      await onSubmit({ contenu: content });
      setContent('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="textarea"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Partagez votre avis sur cette recette..."
        rows={4}
        required
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={!content.trim()}
        >
          Publier le commentaire
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;