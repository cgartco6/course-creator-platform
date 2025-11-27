import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType = 'neutral',
  description,
  loading = false,
  onClick 
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'negative':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive':
        return <TrendingUp className="h-4 w-4" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const formatValue = (val) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return (val / 1000000).toFixed(1) + 'M';
      }
      if (val >= 1000) {
        return (val / 1000).toFixed(1) + 'K';
      }
      return val.toString();
    }
    return val;
  };

  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`card hover:shadow-md transition-shadow duration-200 cursor-pointer group ${
        onClick ? 'hover:border-blue-500' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 mb-1">
            {title}
          </p>
          
          <div className="flex items-baseline space-x-2 mb-2">
            <p className="text-2xl font-bold text-gray-900 truncate">
              {formatValue(value)}
            </p>
            
            {change !== undefined && (
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getChangeColor()}`}>
                {getChangeIcon()}
                <span>{change}%</span>
              </div>
            )}
          </div>

          {description && (
            <p className="text-xs text-gray-500 truncate">
              {description}
            </p>
          )}
        </div>

        <div className="flex-shrink-0">
          <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-200">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Progress Bar for Percentage-based Stats */}
      {(title.includes('Rate') || title.includes('Progress')) && typeof value === 'number' && value <= 100 && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                changeType === 'positive' ? 'bg-green-500' :
                changeType === 'negative' ? 'bg-red-500' :
                'bg-blue-500'
              }`}
              style={{ width: `${value}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

// Default export with memo for performance
export default React.memo(StatsCard);
