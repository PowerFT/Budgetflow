import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Download, Plus, X, Edit2, Trash2, TrendingUp, TrendingDown, DollarSign, Calendar, Tag, PieChart as PieChartIcon } from 'lucide-react';

// Mock authentication - in production, replace with real auth
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check
    const storedUser = localStorage.getItem('expense_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email, password) => {
    // Mock login - in production, call your API
    const user = { id: '1', email, name: email.split('@')[0] };
    localStorage.setItem('expense_user', JSON.stringify(user));
    setUser(user);
  };

  const signup = (email, password, name) => {
    // Mock signup - in production, call your API
    const user = { id: '1', email, name };
    localStorage.setItem('expense_user', JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('expense_user');
    setUser(null);
  };

  return { user, isLoading, login, signup, logout };
};

// Database hook - in production, replace with real API calls
const useExpenses = (userId) => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Other'
  ]);
  const [budgets, setBudgets] = useState({});

  useEffect(() => {
    if (userId) {
      const stored = localStorage.getItem(`expenses_${userId}`);
      if (stored) {
        setExpenses(JSON.parse(stored));
      }
      const storedBudgets = localStorage.getItem(`budgets_${userId}`);
      if (storedBudgets) {
        setBudgets(JSON.parse(storedBudgets));
      }
    }
  }, [userId]);

  const saveExpenses = (newExpenses) => {
    setExpenses(newExpenses);
    localStorage.setItem(`expenses_${userId}`, JSON.stringify(newExpenses));
  };

  const saveBudgets = (newBudgets) => {
    setBudgets(newBudgets);
    localStorage.setItem(`budgets_${userId}`, JSON.stringify(newBudgets));
  };

  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
      date: expense.date || new Date().toISOString(),
      userId
    };
    saveExpenses([...expenses, newExpense]);
  };

  const updateExpense = (id, updates) => {
    saveExpenses(expenses.map(exp => exp.id === id ? { ...exp, ...updates } : exp));
  };

  const deleteExpense = (id) => {
    saveExpenses(expenses.filter(exp => exp.id !== id));
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Amount', 'Category'];
    const rows = expenses.map(exp => [
      new Date(exp.date).toLocaleDateString(),
      exp.description,
      exp.amount,
      exp.category
    ]);
    
    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return {
    expenses,
    categories,
    budgets,
    addExpense,
    updateExpense,
    deleteExpense,
    exportToCSV,
    setBudgets: saveBudgets
  };
};

// Auth Component
const AuthScreen = ({ onLogin, onSignup }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      onLogin(email, password);
    } else {
      onSignup(email, password, name);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(255,107,107,0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(78,205,196,0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse'
      }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Work+Sans:wght@300;400;600;700&display=swap');
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255,107,107,0.3), 0 0 40px rgba(78,205,196,0.2); }
          50% { box-shadow: 0 0 30px rgba(255,107,107,0.4), 0 0 60px rgba(78,205,196,0.3); }
        }

        * {
          font-family: 'Work Sans', sans-serif;
        }
      `}</style>

      <div style={{
        background: 'rgba(20, 20, 30, 0.85)',
        backdropFilter: 'blur(20px)',
        padding: '50px 40px',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        maxWidth: '440px',
        width: '100%',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
        animation: 'slideIn 0.6s ease-out, glow 4s ease-in-out infinite',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '10px',
            display: 'inline-block',
            background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '700',
            fontFamily: "'Space Mono', monospace"
          }}>
            ₿udgetFlow
          </div>
          <p style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '14px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontWeight: '300'
          }}>
            Track Every Penny
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '13px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.target.style.borderColor = '#4ecdc4';
                }}
                onBlur={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '13px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px 18px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '15px',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                e.target.style.borderColor = '#4ecdc4';
              }}
              onBlur={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '13px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px 18px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '15px',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                e.target.style.borderColor = '#4ecdc4';
              }}
              onBlur={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              transition: 'all 0.3s ease',
              marginBottom: '20px'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 10px 25px rgba(255, 107, 107, 0.3)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>

          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              style={{
                background: 'none',
                border: 'none',
                color: '#4ecdc4',
                cursor: 'pointer',
                fontSize: '14px',
                textDecoration: 'underline'
              }}
            >
              {isLogin ? 'Need an account? Sign up' : 'Already have an account? Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main App Component
export default function ExpenseTracker() {
  const { user, isLoading, login, signup, logout } = useAuth();
  const {
    expenses,
    categories,
    budgets,
    addExpense,
    updateExpense,
    deleteExpense,
    exportToCSV,
    setBudgets
  } = useExpenses(user?.id);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: categories[0],
    date: new Date().toISOString().split('T')[0]
  });

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)'
      }}>
        <div style={{ color: 'white', fontSize: '20px' }}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onLogin={login} onSignup={signup} />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingExpense) {
      updateExpense(editingExpense.id, formData);
      setEditingExpense(null);
    } else {
      addExpense(formData);
    }
    setFormData({
      description: '',
      amount: '',
      category: categories[0],
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddModal(false);
  };

  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setFormData({
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      date: new Date(expense.date).toISOString().split('T')[0]
    });
    setShowAddModal(true);
  };

  // Calculate statistics
  const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  const thisMonthExpenses = expenses
    .filter(exp => {
      const expDate = new Date(exp.date);
      const now = new Date();
      return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

  const categoryTotals = categories.map(cat => ({
    name: cat,
    value: expenses
      .filter(exp => exp.category === cat)
      .reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
  })).filter(cat => cat.value > 0);

  // Prepare chart data
  const last6Months = [...Array(6)].map((_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthExpenses = expenses
      .filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === date.getMonth() && 
               expDate.getFullYear() === date.getFullYear();
      })
      .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    
    return {
      month: date.toLocaleString('default', { month: 'short' }),
      amount: monthExpenses
    };
  }).reverse();

  const COLORS = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7b731', '#5f27cd', '#00d2d3', '#ff9ff3'];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      color: 'white',
      fontFamily: "'Work Sans', sans-serif"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Work+Sans:wght@300;400;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .stat-card {
          animation: fadeIn 0.5s ease-out;
        }

        .expense-item {
          transition: all 0.3s ease;
        }

        .expense-item:hover {
          transform: translateX(5px);
          background: rgba(255, 255, 255, 0.08) !important;
        }
      `}</style>

      {/* Header */}
      <div style={{
        background: 'rgba(20, 20, 30, 0.6)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          fontSize: '32px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: "'Space Mono', monospace"
        }}>
          ₿udgetFlow
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
            {user.name || user.email}
          </span>
          <button
            onClick={logout}
            style={{
              padding: '10px 24px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.15)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ padding: '40px' }}>
        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '15px',
          marginBottom: '40px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => {
              setEditingExpense(null);
              setFormData({
                description: '',
                amount: '',
                category: categories[0],
                date: new Date().toISOString().split('T')[0]
              });
              setShowAddModal(true);
            }}
            style={{
              padding: '14px 28px',
              background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 10px 25px rgba(255, 107, 107, 0.3)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <Plus size={20} />
            Add Expense
          </button>
          <button
            onClick={() => setShowBudgetModal(true)}
            style={{
              padding: '14px 28px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.15)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <Tag size={20} />
            Set Budgets
          </button>
          <button
            onClick={exportToCSV}
            style={{
              padding: '14px 28px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.15)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <Download size={20} />
            Export CSV
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div className="stat-card" style={{
            background: 'rgba(255, 107, 107, 0.1)',
            backdropFilter: 'blur(10px)',
            padding: '30px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 107, 107, 0.3)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '15px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'rgba(255, 107, 107, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <DollarSign size={28} color="#ff6b6b" />
              </div>
              <div>
                <div style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: '600'
                }}>
                  Total Expenses
                </div>
                <div style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: '#ff6b6b',
                  fontFamily: "'Space Mono', monospace"
                }}>
                  ${totalExpenses.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className="stat-card" style={{
            background: 'rgba(78, 205, 196, 0.1)',
            backdropFilter: 'blur(10px)',
            padding: '30px',
            borderRadius: '20px',
            border: '1px solid rgba(78, 205, 196, 0.3)',
            animationDelay: '0.1s'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '15px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'rgba(78, 205, 196, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Calendar size={28} color="#4ecdc4" />
              </div>
              <div>
                <div style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: '600'
                }}>
                  This Month
                </div>
                <div style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: '#4ecdc4',
                  fontFamily: "'Space Mono', monospace"
                }}>
                  ${thisMonthExpenses.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className="stat-card" style={{
            background: 'rgba(247, 183, 49, 0.1)',
            backdropFilter: 'blur(10px)',
            padding: '30px',
            borderRadius: '20px',
            border: '1px solid rgba(247, 183, 49, 0.3)',
            animationDelay: '0.2s'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '15px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'rgba(247, 183, 49, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TrendingUp size={28} color="#f7b731" />
              </div>
              <div>
                <div style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: '600'
                }}>
                  Transactions
                </div>
                <div style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: '#f7b731',
                  fontFamily: "'Space Mono', monospace"
                }}>
                  {expenses.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {/* Category Breakdown */}
          <div style={{
            background: 'rgba(20, 20, 30, 0.6)',
            backdropFilter: 'blur(20px)',
            padding: '30px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <PieChartIcon size={24} />
              Category Breakdown
            </h3>
            {categoryTotals.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryTotals}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryTotals.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(20, 20, 30, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255, 255, 255, 0.4)' }}>
                No expenses yet. Add your first expense to see the breakdown.
              </div>
            )}
          </div>

          {/* Spending Trend */}
          <div style={{
            background: 'rgba(20, 20, 30, 0.6)',
            backdropFilter: 'blur(20px)',
            padding: '30px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <TrendingDown size={24} />
              6-Month Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={last6Months}>
                <XAxis dataKey="month" stroke="rgba(255, 255, 255, 0.5)" />
                <YAxis stroke="rgba(255, 255, 255, 0.5)" />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(20, 20, 30, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#4ecdc4"
                  strokeWidth={3}
                  dot={{ fill: '#4ecdc4', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Expenses */}
        <div style={{
          background: 'rgba(20, 20, 30, 0.6)',
          backdropFilter: 'blur(20px)',
          padding: '30px',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '700',
            marginBottom: '20px'
          }}>
            Recent Expenses
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {expenses.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: 'rgba(255, 255, 255, 0.4)'
              }}>
                No expenses yet. Click "Add Expense" to get started!
              </div>
            ) : (
              [...expenses]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 10)
                .map((expense) => {
                  const budget = budgets[expense.category];
                  const categoryTotal = expenses
                    .filter(e => e.category === expense.category)
                    .reduce((sum, e) => sum + parseFloat(e.amount), 0);
                  const overBudget = budget && categoryTotal > parseFloat(budget);

                  return (
                    <div
                      key={expense.id}
                      className="expense-item"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '20px',
                        borderRadius: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        border: overBudget ? '1px solid rgba(255, 107, 107, 0.5)' : '1px solid transparent'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          marginBottom: '5px'
                        }}>
                          {expense.description}
                        </div>
                        <div style={{
                          fontSize: '13px',
                          color: 'rgba(255, 255, 255, 0.5)',
                          display: 'flex',
                          gap: '15px'
                        }}>
                          <span>{new Date(expense.date).toLocaleDateString()}</span>
                          <span style={{
                            padding: '2px 10px',
                            background: 'rgba(78, 205, 196, 0.2)',
                            borderRadius: '6px',
                            fontSize: '12px'
                          }}>
                            {expense.category}
                          </span>
                          {overBudget && (
                            <span style={{
                              padding: '2px 10px',
                              background: 'rgba(255, 107, 107, 0.2)',
                              borderRadius: '6px',
                              fontSize: '12px',
                              color: '#ff6b6b'
                            }}>
                              Over Budget
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px'
                      }}>
                        <div style={{
                          fontSize: '20px',
                          fontWeight: '700',
                          color: '#ff6b6b',
                          fontFamily: "'Space Mono', monospace"
                        }}>
                          ${parseFloat(expense.amount).toFixed(2)}
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button
                            onClick={() => openEditModal(expense)}
                            style={{
                              background: 'rgba(78, 205, 196, 0.2)',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.background = 'rgba(78, 205, 196, 0.3)';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.background = 'rgba(78, 205, 196, 0.2)';
                            }}
                          >
                            <Edit2 size={18} color="#4ecdc4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Delete this expense?')) {
                                deleteExpense(expense.id);
                              }
                            }}
                            style={{
                              background: 'rgba(255, 107, 107, 0.2)',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.background = 'rgba(255, 107, 107, 0.3)';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.background = 'rgba(255, 107, 107, 0.2)';
                            }}
                          >
                            <Trash2 size={18} color="#ff6b6b" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Expense Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'rgba(20, 20, 30, 0.95)',
            backdropFilter: 'blur(20px)',
            padding: '40px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            maxWidth: '500px',
            width: '100%',
            position: 'relative'
          }}>
            <button
              onClick={() => {
                setShowAddModal(false);
                setEditingExpense(null);
              }}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '5px'
              }}
            >
              <X size={24} />
            </button>

            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '30px'
            }}>
              {editingExpense ? 'Edit Expense' : 'Add New Expense'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '13px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '13px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '13px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} style={{ background: '#1a1a2e' }}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '13px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 10px 25px rgba(255, 107, 107, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {editingExpense ? 'Update Expense' : 'Add Expense'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Budget Modal */}
      {showBudgetModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'rgba(20, 20, 30, 0.95)',
            backdropFilter: 'blur(20px)',
            padding: '40px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            maxWidth: '500px',
            width: '100%',
            position: 'relative',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <button
              onClick={() => setShowBudgetModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '5px'
              }}
            >
              <X size={24} />
            </button>

            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '30px'
            }}>
              Set Category Budgets
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {categories.map(category => {
                const categoryTotal = expenses
                  .filter(exp => exp.category === category)
                  .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
                const budget = budgets[category] || '';

                return (
                  <div key={category}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '13px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      {category}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={budget}
                      onChange={(e) => {
                        setBudgets({ ...budgets, [category]: e.target.value });
                      }}
                      placeholder="Set monthly budget"
                      style={{
                        width: '100%',
                        padding: '14px 18px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: '15px',
                        outline: 'none'
                      }}
                    />
                    <div style={{
                      marginTop: '8px',
                      fontSize: '12px',
                      color: categoryTotal > parseFloat(budget) && budget ? '#ff6b6b' : 'rgba(255, 255, 255, 0.5)'
                    }}>
                      Current spending: ${categoryTotal.toFixed(2)}
                      {budget && ` / $${parseFloat(budget).toFixed(2)}`}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowBudgetModal(false)}
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                marginTop: '30px'
              }}
            >
              Save Budgets
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
