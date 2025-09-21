import React, { useState, useMemo } from 'react';

// --- Helper Data & Functions ---
const initialPantryItems = {
  'item-1': { name: 'Assam Tea', price: 5, stock: 100 },
  'item-2': { name: 'Filter Coffee', price: 10, stock: 100 },
  'item-3': { name: 'Ginger Tea', price: 7, stock: 80 },
  'item-4': { name: 'Chocolate Chip Cookies', price: 15, stock: 200 },
  'item-5': { name: 'Veg Puffs', price: 20, stock: 50 },
  'item-6': { name: 'Samosa', price: 12, stock: 60 },
};

const initialConsumptionLog = [
  { id: 'log-1', itemId: 'item-2', quantity: 2, user: 'Alex', timestamp: new Date(2025, 8, 21, 9, 5).toISOString() },
  { id: 'log-2', itemId: 'item-4', quantity: 5, user: 'Visitor', timestamp: new Date(2025, 8, 21, 9, 15).toISOString() },
  { id: 'log-3', itemId: 'item-1', quantity: 1, user: 'Ben', timestamp: new Date(2025, 8, 20, 14, 30).toISOString() },
  { id: 'log-4', itemId: 'item-5', quantity: 2, user: 'Carla', timestamp: new Date(2025, 8, 20, 12, 0).toISOString() },
  { id: 'log-5', itemId: 'item-2', quantity: 1, user: 'Alex', timestamp: new Date(2025, 8, 19, 10, 0).toISOString() },
];

// --- Icon Components (using inline SVG for portability) ---
const CoffeeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 21h7a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Z" /><path d="M17 5v-2a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2" /><path d="M17 12a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const StoreIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" /><path d="M2 7h20" /><path d="M22 7v3a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V7" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>;
const FileTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>;
const DollarSignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>;
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>;
const BarChart2Icon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>;


// --- Main App Component ---
export default function App() {
  const [screen, setScreen] = useState('login'); // login, adminDashboard, adminLogs, adminReport, vendorDashboard, vendorItems, vendorInvoice
  const [userRole, setUserRole] = useState(null); // 'admin' or 'vendor'
  const [pantryItems, setPantryItems] = useState(initialPantryItems);
  const [consumptionLog, setConsumptionLog] = useState(initialConsumptionLog);

  const navigate = (newScreen) => setScreen(newScreen);
  
  const handleLogin = (role) => {
    setUserRole(role);
    navigate(role === 'admin' ? 'adminDashboard' : 'vendorDashboard');
  };

  const handleLogout = () => {
    setUserRole(null);
    navigate('login');
  }

  const handleLogConsumption = (logEntry) => {
    const newLog = {
      id: `log-${Date.now()}`,
      ...logEntry,
      timestamp: new Date().toISOString()
    };
    setConsumptionLog([newLog, ...consumptionLog]);
    // Optional: Decrement stock
    setPantryItems(prev => ({
        ...prev,
        [logEntry.itemId]: {
            ...prev[logEntry.itemId],
            stock: prev[logEntry.itemId].stock - logEntry.quantity
        }
    }));
    alert('Consumption logged successfully!');
  };

  const handleUpdatePrice = (itemId, newPrice) => {
    setPantryItems(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], price: parseFloat(newPrice) || 0 }
    }));
  };

  const renderScreen = () => {
    switch (screen) {
      case 'login':
        return <LoginScreen onLogin={handleLogin} />;
      case 'adminDashboard':
        return <AdminDashboard navigate={navigate} onLogConsumption={handleLogConsumption} pantryItems={pantryItems} consumptionLog={consumptionLog} />;
      case 'adminLogs':
        return <AdminLogsScreen navigate={navigate} consumptionLog={consumptionLog} pantryItems={pantryItems} />;
      case 'adminReport':
        return <AdminReportScreen navigate={navigate} consumptionLog={consumptionLog} pantryItems={pantryItems} />;
      case 'vendorDashboard':
        return <VendorDashboard navigate={navigate} consumptionLog={consumptionLog} pantryItems={pantryItems} />;
      case 'vendorItems':
        return <VendorItemsScreen navigate={navigate} pantryItems={pantryItems} onUpdatePrice={handleUpdatePrice} />;
      case 'vendorInvoice':
        return <VendorInvoiceScreen navigate={navigate} consumptionLog={consumptionLog} pantryItems={pantryItems} />;
      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return (
    <div className="bg-gray-50 font-sans min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden relative">
        <Header userRole={userRole} onLogout={handleLogout} />
        <main className="p-6">{renderScreen()}</main>
      </div>
    </div>
  );
}

// --- Header Component ---
const Header = ({ userRole, onLogout }) => {
  if (!userRole) return null;
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold capitalize">{userRole} Portal</h1>
      <button onClick={onLogout} className="text-sm text-gray-300 hover:text-white transition-colors">Logout</button>
    </header>
  )
};

// --- Screen 1: Login ---
const LoginScreen = ({ onLogin }) => (
  <div className="text-center">
    <div className="flex justify-center items-center mb-6">
        <CoffeeIcon />
        <h1 className="text-2xl font-bold ml-2 text-gray-800">PantryPro</h1>
    </div>
    <p className="text-gray-600 mb-8">Please select your role to continue.</p>
    <div className="space-y-4">
      <button onClick={() => onLogin('admin')} className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105">
        <UserIcon /> <span className="ml-2">Company Admin</span>
      </button>
      <button onClick={() => onLogin('vendor')} className="w-full flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105">
        <StoreIcon /> <span className="ml-2">Vendor</span>
      </button>
    </div>
  </div>
);


// --- Screen 2: Admin Dashboard ---
const AdminDashboard = ({ navigate, onLogConsumption, pantryItems, consumptionLog }) => {
  const [itemId, setItemId] = useState(Object.keys(pantryItems)[0]);
  const [quantity, setQuantity] = useState(1);
  const [user, setUser] = useState('Employee');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!itemId || quantity < 1 || !user) {
      alert("Please fill all fields.");
      return;
    }
    onLogConsumption({ itemId, quantity, user });
    setQuantity(1);
    setUser('Employee');
  };
  
  const today = new Date().toISOString().split('T')[0];
  const todaysLogs = consumptionLog.filter(log => log.timestamp.startsWith(today));

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>
      
      {/* Log Consumption Form */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h3 className="font-bold text-lg mb-3 text-gray-700">Log New Consumption</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
              <select value={itemId} onChange={(e) => setItemId(e.target.value)} className="w-full p-2 border rounded-md">
                  {Object.entries(pantryItems).map(([id, item]) => (
                      <option key={id} value={id}>{item.name}</option>
                  ))}
              </select>
              <div className="flex gap-3">
                  <input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} className="w-1/2 p-2 border rounded-md" placeholder="Quantity" min="1"/>
                  <input type="text" value={user} onChange={(e) => setUser(e.target.value)} className="w-1/2 p-2 border rounded-md" placeholder="Consumed by (e.g. Employee)"/>
              </div>
              <button type="submit" className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors">
                  <PlusIcon /> <span className="ml-2">Log Item</span>
              </button>
          </form>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button onClick={() => navigate('adminLogs')} className="flex flex-col items-center justify-center bg-white p-4 border rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
            <ListIcon /> <span className="mt-2 text-sm font-semibold text-gray-700">View Full Log</span>
        </button>
        <button onClick={() => navigate('adminReport')} className="flex flex-col items-center justify-center bg-white p-4 border rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
            <BarChart2Icon /> <span className="mt-2 text-sm font-semibold text-gray-700">Generate Report</span>
        </button>
      </div>
      
      {/* Today's Consumption */}
      <div>
        <h3 className="font-bold text-lg mb-3 text-gray-700">Today's Consumption ({todaysLogs.length})</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {todaysLogs.length > 0 ? todaysLogs.map(log => (
            <div key={log.id} className="bg-white p-2 border rounded-md text-sm flex justify-between">
              <span>{log.quantity} x {pantryItems[log.itemId]?.name}</span>
              <span className="text-gray-500">{log.user}</span>
            </div>
          )) : <p className="text-gray-500 text-sm">No items logged yet today.</p>}
        </div>
      </div>
    </div>
  );
};


// --- Screen 3: Admin Consumption Logs ---
const AdminLogsScreen = ({ navigate, consumptionLog, pantryItems }) => (
  <div>
    <div className="flex items-center mb-6">
        <button onClick={() => navigate('adminDashboard')} className="p-1 rounded-full hover:bg-gray-100 mr-3">
            <ChevronLeftIcon />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Consumption Log</h2>
    </div>
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {consumptionLog.map(log => (
        <div key={log.id} className="bg-white p-3 border rounded-lg shadow-sm">
          <div className="flex justify-between font-semibold">
            <span>{pantryItems[log.itemId]?.name}</span>
            <span>Qty: {log.quantity}</span>
          </div>
          <div className="text-sm text-gray-500 mt-1 flex justify-between">
            <span>By: {log.user}</span>
            <span>{new Date(log.timestamp).toLocaleString()}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// --- Admin Report Screen ---
const AdminReportScreen = ({ navigate, consumptionLog, pantryItems }) => {
  const reportData = useMemo(() => {
    const summary = {};
    consumptionLog.forEach(log => {
      if (!summary[log.itemId]) {
        summary[log.itemId] = {
          name: pantryItems[log.itemId]?.name || 'Unknown Item',
          price: pantryItems[log.itemId]?.price || 0,
          quantity: 0,
          total: 0,
        };
      }
      summary[log.itemId].quantity += log.quantity;
      summary[log.itemId].total += log.quantity * summary[log.itemId].price;
    });
    return Object.values(summary);
  }, [consumptionLog, pantryItems]);
  
  const grandTotal = reportData.reduce((total, item) => total + item.total, 0);

  return (
    <div>
        <div className="flex items-center mb-6">
            <button onClick={() => navigate('adminDashboard')} className="p-1 rounded-full hover:bg-gray-100 mr-3">
                <ChevronLeftIcon />
            </button>
            <h2 className="text-2xl font-bold text-gray-800">Consumption Report</h2>
        </div>
        
        <div className="border rounded-lg p-4 bg-white">
            <div className="mb-4 pb-2 border-b">
                <h3 className="font-bold text-lg">Overall Summary</h3>
                <p className="text-sm text-gray-500">For period: September 2025</p>
            </div>

            {/* Report Table */}
            <table className="w-full text-sm mb-4">
                <thead>
                    <tr className="border-b">
                        <th className="text-left font-semibold p-2">Item</th>
                        <th className="text-center font-semibold p-2">Total Consumed</th>
                        <th className="text-right font-semibold p-2">Total Cost</th>
                    </tr>
                </thead>
                <tbody>
                    {reportData.map(item => (
                        <tr key={item.name} className="border-b">
                            <td className="p-2">{item.name}</td>
                            <td className="text-center p-2">{item.quantity}</td>
                            <td className="text-right p-2">${item.total.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {/* Grand Total */}
            <div className="flex justify-end mt-4">
                <div className="text-right">
                    <p className="text-gray-600">Total Consumption Cost:</p>
                    <p className="text-2xl font-bold text-gray-800">${grandTotal.toFixed(2)}</p>
                </div>
            </div>
        </div>

        <button onClick={() => alert("Downloading report...")} className="mt-6 w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors">
            <DownloadIcon /> <span className="ml-2">Download Report</span>
        </button>
    </div>
  );
};

// --- Screen 4: Vendor Dashboard ---
const VendorDashboard = ({ navigate, consumptionLog, pantryItems }) => {
    const totalItemsSold = useMemo(() => {
        return consumptionLog.reduce((total, log) => total + log.quantity, 0);
    }, [consumptionLog]);

    const totalRevenue = useMemo(() => {
        return consumptionLog.reduce((total, log) => {
            const item = pantryItems[log.itemId];
            return total + (item ? item.price * log.quantity : 0);
        }, 0);
    }, [consumptionLog, pantryItems]);


    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Vendor Dashboard</h2>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-100 p-4 rounded-lg text-center">
                    <p className="text-sm text-green-800">Total Items Sold</p>
                    <p className="text-2xl font-bold text-green-900">{totalItemsSold}</p>
                </div>
                <div className="bg-yellow-100 p-4 rounded-lg text-center">
                    <p className="text-sm text-yellow-800">Est. Revenue</p>
                    <p className="text-2xl font-bold text-yellow-900">${totalRevenue.toFixed(2)}</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <button onClick={() => navigate('vendorItems')} className="flex flex-col items-center justify-center bg-white p-4 border rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
                    <DollarSignIcon /> <span className="mt-2 text-sm font-semibold text-gray-700">Manage Prices</span>
                </button>
                <button onClick={() => navigate('vendorInvoice')} className="flex flex-col items-center justify-center bg-white p-4 border rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
                    <FileTextIcon /> <span className="mt-2 text-sm font-semibold text-gray-700">Generate Invoice</span>
                </button>
            </div>
            
            {/* Recently Sold Items */}
             <div>
                <h3 className="font-bold text-lg mb-3 text-gray-700">Recently Sold Items</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                {consumptionLog.slice(0, 5).map(log => (
                    <div key={log.id} className="bg-white p-2 border rounded-md text-sm flex justify-between">
                    <span>{log.quantity} x {pantryItems[log.itemId]?.name}</span>
                    <span className="text-gray-500 font-semibold">${((pantryItems[log.itemId]?.price || 0) * log.quantity).toFixed(2)}</span>
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
};

// --- Screen 5: Vendor Item & Price Management ---
const VendorItemsScreen = ({ navigate, pantryItems, onUpdatePrice }) => {
  const [editingItemId, setEditingItemId] = useState(null);
  const [newPrice, setNewPrice] = useState('');

  const handleEdit = (itemId, currentPrice) => {
    setEditingItemId(itemId);
    setNewPrice(currentPrice);
  };
  
  const handleSave = (itemId) => {
    onUpdatePrice(itemId, newPrice);
    setEditingItemId(null);
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button onClick={() => navigate('vendorDashboard')} className="p-1 rounded-full hover:bg-gray-100 mr-3">
          <ChevronLeftIcon />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Manage Item Prices</h2>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {Object.entries(pantryItems).map(([id, item]) => (
          <div key={id} className="bg-white p-3 border rounded-lg shadow-sm flex items-center justify-between">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">Current Stock: {item.stock}</p>
            </div>
            {editingItemId === id ? (
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-600">$</span>
                <input 
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-20 p-1 border rounded-md"
                  autoFocus
                />
                <button onClick={() => handleSave(id)} className="bg-green-500 text-white px-3 py-1 text-sm rounded-md">Save</button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <p className="font-bold text-lg text-gray-700">${item.price.toFixed(2)}</p>
                <button onClick={() => handleEdit(id, item.price)} className="text-blue-500 text-sm font-semibold">Edit</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Screen 6: Vendor Invoice Generation ---
const VendorInvoiceScreen = ({ navigate, consumptionLog, pantryItems }) => {
  const invoiceData = useMemo(() => {
    const summary = {};
    consumptionLog.forEach(log => {
      if (!summary[log.itemId]) {
        summary[log.itemId] = {
          name: pantryItems[log.itemId]?.name || 'Unknown Item',
          price: pantryItems[log.itemId]?.price || 0,
          quantity: 0,
          total: 0,
        };
      }
      summary[log.itemId].quantity += log.quantity;
      summary[log.itemId].total += log.quantity * summary[log.itemId].price;
    });
    return Object.values(summary);
  }, [consumptionLog, pantryItems]);
  
  const grandTotal = invoiceData.reduce((total, item) => total + item.total, 0);

  return (
    <div>
        <div className="flex items-center mb-6">
            <button onClick={() => navigate('vendorDashboard')} className="p-1 rounded-full hover:bg-gray-100 mr-3">
                <ChevronLeftIcon />
            </button>
            <h2 className="text-2xl font-bold text-gray-800">Monthly Invoice</h2>
        </div>
        
        <div className="border rounded-lg p-4 bg-white">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
                <div>
                    <h3 className="font-bold text-lg">Invoice #INV-09-2025</h3>
                    <p className="text-sm text-gray-500">Date: September 21, 2025</p>
                </div>
                <div className="text-right">
                    <p className="font-semibold">Billed To:</p>
                    <p className="text-sm">Corporate Client Inc.</p>
                </div>
            </div>

            {/* Invoice Table */}
            <table className="w-full text-sm mb-4">
                <thead>
                    <tr className="border-b">
                        <th className="text-left font-semibold p-2">Item</th>
                        <th className="text-center font-semibold p-2">Qty</th>
                        <th className="text-right font-semibold p-2">Price</th>
                        <th className="text-right font-semibold p-2">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {invoiceData.map(item => (
                        <tr key={item.name} className="border-b">
                            <td className="p-2">{item.name}</td>
                            <td className="text-center p-2">{item.quantity}</td>
                            <td className="text-right p-2">${item.price.toFixed(2)}</td>
                            <td className="text-right p-2">${item.total.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {/* Grand Total */}
            <div className="flex justify-end mt-4">
                <div className="text-right">
                    <p className="text-gray-600">Subtotal:</p>
                    <p className="text-2xl font-bold text-gray-800">${grandTotal.toFixed(2)}</p>
                </div>
            </div>
        </div>

        <button onClick={() => alert("Downloading invoice...")} className="mt-6 w-full flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors">
            <DownloadIcon /> <span className="ml-2">Download as PDF</span>
        </button>
    </div>
  );
};

