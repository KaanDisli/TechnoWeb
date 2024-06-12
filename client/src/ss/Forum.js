import React from 'react';

const Forum = ({ forumType }) => {
  return (
    <div className="forum">
      <h2>{forumType === 'open' ? 'Forum ouvert' : 'Forum fermé'}</h2>
      {/* Ici, affichez les discussions selon le forumType */}
    </div>
  );
};

export default Forum;
