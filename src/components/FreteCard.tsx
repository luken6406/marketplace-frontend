import React from 'react';

export interface OpcaoFrete {
  id: number;
  name: string;
  price: string;
  custom_price: string;
  delivery_time: number;
  error?: string;
  company: {
    id: number;
    name: string;
    picture: string;
  };
}

interface FreteCardProps {
  frete: OpcaoFrete;
  onSelect?: (frete: OpcaoFrete) => void;
  isSelected?: boolean;
}

export const FreteCard: React.FC<FreteCardProps> = ({ frete, onSelect, isSelected }) => {
  return (
    <div 
      onClick={() => onSelect && onSelect(frete)}
      style={{
        border: isSelected ? '2px solid #0066FF' : '1px solid #E2E8F0',
        borderRadius: '8px',
        padding: '12px 16px',
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        backgroundColor: isSelected ? '#F0F7FF' : '#FFFFFF',
        transition: 'all 0.2s ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {frete.company?.picture && (
          <img 
            src={frete.company.picture} 
            alt={frete.company.name} 
            style={{ width: '40px', height: '40px', objectFit: 'contain' }} 
          />
        )}
        <div>
          <strong style={{ display: 'block', fontSize: '14px', color: '#1A202C' }}>
            {frete.company?.name} - {frete.name}
          </strong>
          <span style={{ fontSize: '12px', color: '#718096' }}>
            Chega em até {frete.delivery_time} {frete.delivery_time === 1 ? 'dia útil' : 'dias úteis'}
          </span>
        </div>
      </div>

      <div style={{ textAlign: 'right' }}>
        <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#2B6CB0' }}>
          R$ {parseFloat(frete.custom_price || frete.price).toFixed(2).replace('.', ',')}
        </span>
      </div>
    </div>
  );
};