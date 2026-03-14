import React from 'react';

function Stats({ tasks }) {
  const total = tasks.length;
  const pending = tasks.filter(t => t.status === 'pending').length;
  const done = tasks.filter(t => t.status === 'done').length;
  const percentage = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '600px',
        margin: '20px auto',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '12px',
        color: 'white',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}
    >
      <h3 style={{ margin: '0 0 15px 0' }}>📊 Your Progress</h3>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginBottom: '15px',
          flexWrap: 'wrap',
          gap: '15px',
        }}
      >
        <div style={{ textAlign: 'center', minWidth: '80px' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{total}</div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Tasks</div>
        </div>

        <div style={{ textAlign: 'center', minWidth: '80px' }}>
          <div
            style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffd700' }}
          >
            {pending}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>Pending</div>
        </div>

        <div style={{ textAlign: 'center', minWidth: '80px' }}>
          <div
            style={{ fontSize: '32px', fontWeight: 'bold', color: '#90EE90' }}
          >
            {done}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>Completed</div>
        </div>
      </div>

      <div
        style={{
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '10px',
          height: '24px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            background: '#90EE90',
            height: '100%',
            width: `${percentage}%`,
            transition: 'width 0.5s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            fontWeight: 'bold',
            color: '#333',
          }}
        >
          {percentage > 0 && `${percentage}%`}
        </div>
      </div>

      {percentage === 100 && total > 0 && (
        <div
          style={{
            marginTop: '15px',
            textAlign: 'center',
            fontSize: '20px',
            animation: 'bounce 1s infinite',
          }}
        >
          🎉 All tasks completed! Amazing! 🎉
        </div>
      )}

      {total === 0 && (
        <div
          style={{
            marginTop: '10px',
            textAlign: 'center',
            fontSize: '16px',
            opacity: 0.9,
          }}
        >
          No tasks yet. Create your first one! 👆
        </div>
      )}
    </div>
  );
}

export default Stats;
