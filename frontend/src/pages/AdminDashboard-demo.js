/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useDemoAuth } from '../components/DemoAuthenticator';
import { useLanguage } from '../contexts/LanguageContext';
import { useSharedData } from '../contexts/SharedDataContext-demo';

// Pagination component - moved outside to avoid hooks rule violations
const PaginationControls = ({ currentPage, totalPages, onPageChange, dataType, t, filteredMembers, filteredPrizes, filteredItems, ITEMS_PER_PAGE }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between mt-6 px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
      <div className="flex items-center text-sm text-gray-700">
        <span>
          {t('showing')} {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, dataType === 'members' ? filteredMembers.length : dataType === 'prizes' ? filteredPrizes.length : filteredItems.length)} {t('of')} {dataType === 'members' ? filteredMembers.length : dataType === 'prizes' ? filteredPrizes.length : filteredItems.length}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('previous')}
        </button>
        
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`px-3 py-1 text-sm border rounded-md ${
              page === currentPage
                ? 'bg-blue-600 text-white border-blue-600'
                : page === '...'
                ? 'border-transparent cursor-default'
                : 'border-gray-300 bg-white hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('next')}
        </button>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { isAdmin, isSales, userRole } = useDemoAuth();
  const { t, isChinese } = useLanguage();
  
  // Demo settings
  const settings = { theme: 'light', notifications: true };
  const updateSettings = () => {};
  
  // Permission helpers
  const canManageUsers = isAdmin;
  const canManageMembers = isAdmin || isSales;
  const {
    members: allMembers,
    prizes,
    items,
    users,
    branches: sharedBranches,
    transactions,
    addMember,
    updateMember,
    deleteMember,
    searchMembers,
    addPrize,
    updatePrize,
    deletePrize,
    addItem,
    updateItem,
    deleteItem,
    addUser,
    updateUser,
    deleteUser,
    addBranch,
    updateBranch,
    deleteBranch,
    processPointTransaction,
    getMemberTransactions,
    recognizeBarcode
  } = useSharedData();
  const [activeTab, setActiveTab] = useState('scan');
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddBranch, setShowAddBranch] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [newBranch, setNewBranch] = useState({
    name: '',
    location: '',
    whatsapp: '',
    phone: ''
  });

  // User management states
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    username: '',
    name: '',
    email: '',
    role: 'sales',
    password: ''
  });

  // Enhanced member management
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [newMember, setNewMember] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
    points: 0,
    gender: 'male',
    birthday: '',
    password: ''
  });

  // Search and pagination states
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [memberCurrentPage, setMemberCurrentPage] = useState(1);
  const [prizeSearchQuery, setPrizeSearchQuery] = useState('');
  const [prizeCurrentPage, setPrizeCurrentPage] = useState(1);
  const [itemSearchQuery, setItemSearchQuery] = useState('');
  const [itemCurrentPage, setItemCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  // Member history modal
  const [showMemberHistory, setShowMemberHistory] = useState(false);
  const [selectedMemberForHistory, setSelectedMemberForHistory] = useState(null);

  // Point adjustment modal
  const [showPointAdjustment, setShowPointAdjustment] = useState(false);
  const [selectedMemberForAdjustment, setSelectedMemberForAdjustment] = useState(null);
  const [pointAdjustment, setPointAdjustment] = useState({
    points: 0,
    type: 'add', // 'add' or 'subtract'
    reason: ''
  });

  // Account management states
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Admin password management states
  const [showAdminChangePassword, setShowAdminChangePassword] = useState(false);
  const [selectedUserForPassword, setSelectedUserForPassword] = useState(null);
  const [adminPasswordForm, setAdminPasswordForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  // Prize management states
  const [showAddPrize, setShowAddPrize] = useState(false);
  const [editingPrize, setEditingPrize] = useState(null);
  const [newPrize, setNewPrize] = useState({
    name: '',
    barcode: '',
    cost_points: 0,
    points_reward: 0,
    stock: 0,
    description: ''
  });

  // Item management states
  const [showAddItem, setShowAddItem] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    barcode: '',
    points_value: 0
  });

  // Scanner states
  const [scannerActive, setScannerActive] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanType, setScanType] = useState('user'); // 'user' or 'item'

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (isAdmin || isSales) {
      fetchBranches();
    }
  }, [isAdmin, isSales, sharedBranches]);

  // Redirect Sales users (but not Admin) away from admin-only tabs
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (isSales && !isAdmin && ['users', 'branches', 'settings'].includes(activeTab)) {
      setActiveTab('scan'); // Redirect to default tab
    }
  }, [isSales, isAdmin, activeTab]);

  const fetchBranches = async () => {
    try {
      // Use branches from SharedDataContext instead of mock data
      if (sharedBranches && sharedBranches.length > 0) {
        setBranches(sharedBranches);
        setSelectedBranch(sharedBranches[0].id);
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };





  const handleSearchMembers = (query) => {
    const results = searchMembers(query);
    setMembers(results);
  };

  // Search and pagination helper functions
  const filterMembers = (members, query) => {
    if (!query.trim()) return members;
    return members.filter(member =>
      member.name.toLowerCase().includes(query.toLowerCase()) ||
      member.username.toLowerCase().includes(query.toLowerCase()) ||
      member.email.toLowerCase().includes(query.toLowerCase())
    );
  };

  const filterPrizes = (prizes, query) => {
    if (!query.trim()) return prizes;
    return prizes.filter(prize =>
      prize.name.toLowerCase().includes(query.toLowerCase()) ||
      prize.description?.toLowerCase().includes(query.toLowerCase()) ||
      prize.barcode.includes(query)
    );
  };

  const filterItems = (items, query) => {
    if (!query.trim()) return items;
    return items.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.barcode.includes(query)
    );
  };

  const paginateData = (data, currentPage, itemsPerPage = ITEMS_PER_PAGE) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (dataLength, itemsPerPage = ITEMS_PER_PAGE) => {
    return Math.ceil(dataLength / itemsPerPage);
  };

  // Get filtered and paginated data
  const filteredMembers = filterMembers(allMembers, memberSearchQuery);
  const paginatedMembers = paginateData(filteredMembers, memberCurrentPage);
  const memberTotalPages = getTotalPages(filteredMembers.length);

  const filteredPrizes = filterPrizes(prizes, prizeSearchQuery);
  const paginatedPrizes = paginateData(filteredPrizes, prizeCurrentPage);
  const prizeTotalPages = getTotalPages(filteredPrizes.length);

  const filteredItems = filterItems(items, itemSearchQuery);
  const paginatedItems = paginateData(filteredItems, itemCurrentPage);
  const itemTotalPages = getTotalPages(filteredItems.length);

  const handlePointTransaction = async (userId, points, type, itemName) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Process the transaction
      const transaction = processPointTransaction(
        userId, 
        points, 
        type === 'add' ? 'earn' : 'redeem', 
        itemName, 
        selectedBranch
      );
      
      // Update prize stock if redeeming
      if (type === 'redeem') {
        const prize = prizes.find(p => p.name === itemName);
        if (prize && prize.stock > 0) {
          updatePrize(prize.id, { stock: prize.stock - 1 });
        }
      }
      
      // Get updated member info
      const updatedMember = allMembers.find(m => m.id === userId);
      
      alert(`Successfully ${type === 'add' ? 'earned' : 'redeemed'} ${Math.abs(points)} points!\n${updatedMember?.name} now has ${updatedMember?.points} points. (Demo mode)`);
      setScanResult(null);
    } catch (error) {
      console.error('Error processing transaction:', error);
      alert('Error processing transaction');
    } finally {
      setLoading(false);
    }
  };

  const updatePrizeStock = async (prizeId, newStock) => {
    try {
      // Demo version - update shared data
      updatePrize(prizeId, { stock: newStock });
      alert('Prize stock updated successfully! (Demo mode)');
    } catch (error) {
      console.error('Error updating prize stock:', error);
      alert('Error updating prize stock');
    }
  };



  const handleAddBranch = async () => {
    console.log('handleAddBranch called', newBranch);
    
    if (!newBranch.name || !newBranch.location) {
      alert('Please fill in branch name and location');
      return;
    }

    setLoading(true);
    try {
      // Demo version - add to settings context
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const branch = {
        id: Date.now().toString(),
        ...newBranch
      };

      console.log('Adding branch:', branch);
      const updatedBranches = [...(settings.branches || []), branch];
      console.log('Updated branches:', updatedBranches);
      
      await updateSettings({ branches: updatedBranches });

      // Reset form
      setNewBranch({ name: '', location: '', whatsapp: '', phone: '' });
      setShowAddBranch(false);
      alert(`Branch added successfully! (Demo mode)`);
    } catch (error) {
      console.error('Error adding branch:', error);
      alert('Error adding branch: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAddBranch = () => {
    console.log('handleCancelAddBranch called');
    setShowAddBranch(false);
    setEditingBranch(null); // Close edit form if open
    setNewBranch({ name: '', location: '', whatsapp: '', phone: '' });
  };

  const handleEditBranch = (branch) => {
    console.log('handleEditBranch called', branch);
    setEditingBranch({ ...branch });
    setShowAddBranch(false); // Close add form if open
  };

  const handleUpdateBranch = async () => {
    if (!editingBranch.name || !editingBranch.location) {
      alert('Please fill in branch name and location');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedBranches = settings.branches.map(branch => 
        branch.id === editingBranch.id ? editingBranch : branch
      );
      
      await updateSettings({ branches: updatedBranches });
      setEditingBranch(null);
      alert(`Branch updated successfully! (Demo mode)`);
    } catch (error) {
      console.error('Error updating branch:', error);
      alert('Error updating branch: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    console.log('handleCancelEdit called');
    setEditingBranch(null);
  };

  const handleDeleteBranch = async (branchId, branchName) => {
    if (!window.confirm(`Are you sure you want to delete "${branchName}"?`)) {
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedBranches = settings.branches.filter(branch => branch.id !== branchId);
      await updateSettings({ branches: updatedBranches });
      alert(`Branch "${branchName}" deleted successfully! (Demo mode)`);
    } catch (error) {
      console.error('Error deleting branch:', error);
      alert('Error deleting branch: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // User Management Functions
  const handleAddUser = async () => {
    if (!newUser.username || !newUser.name || !newUser.email || !newUser.password) {
      alert('Please fill in all required fields (Username, Name, Email, Password)');
      return;
    }

    if (newUser.password.length < 6) {
      alert(t('passwordMinLength'));
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = addUser(newUser);
      setNewUser({ username: '', name: '', email: '', role: 'sales', password: '' });
      setShowAddUser(false);
      alert(`User "${user.name}" added successfully! (Demo mode)`);
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Error adding user: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser({ ...user });
    setShowAddUser(false);
  };

  const handleUpdateUser = async () => {
    if (!editingUser.username || !editingUser.name || !editingUser.email) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateUser(editingUser.id, editingUser);
      setEditingUser(null);
      alert(`User updated successfully! (Demo mode)`);
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      deleteUser(userId);
      alert(`User "${userName}" deleted successfully! (Demo mode)`);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (memberId, memberName) => {
    if (!window.confirm(`Are you sure you want to delete member "${memberName}"?`)) {
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      deleteMember(memberId);
      alert(`Member "${memberName}" deleted successfully! (Demo mode)`);
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('Error deleting member: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Member CRUD Functions
  const handleAddMember = async () => {
    if (!newMember.username || !newMember.name || !newMember.email || !newMember.password) {
      alert('Please fill in all required fields (Username, Name, Email, Password)');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const memberData = {
        ...newMember,
        points: parseInt(newMember.points) || 0
      };

      const member = addMember(memberData);
      setNewMember({ username: '', name: '', email: '', phone: '', points: 0, gender: 'male', birthday: '', password: '' });
      setShowAddMember(false);
      alert(`Member "${member.name}" added successfully! (Demo mode)`);
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Error adding member: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditMember = (member) => {
    setEditingMember({ ...member });
    setShowAddMember(false);
  };

  const handleUpdateMember = async () => {
    if (!editingMember.username || !editingMember.name || !editingMember.email) {
      alert('Please fill in all required fields (Username, Name, Email)');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updates = {
        ...editingMember,
        points: parseInt(editingMember.points) || 0
      };
      
      updateMember(editingMember.id, updates);
      setEditingMember(null);
      alert(`Member updated successfully! (Demo mode)`);
    } catch (error) {
      console.error('Error updating member:', error);
      alert('Error updating member: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Prize CRUD Functions
  const handleAddPrize = async () => {
    if (!newPrize.name || !newPrize.barcode || !newPrize.cost_points) {
      alert('Please fill in prize name, barcode, and cost points');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const prizeData = {
        ...newPrize,
        cost_points: parseInt(newPrize.cost_points) || 0,
        points_reward: parseInt(newPrize.points_reward) || 0,
        stock: parseInt(newPrize.stock) || 0
      };

      const prize = addPrize(prizeData);
      setNewPrize({ name: '', barcode: '', cost_points: 0, points_reward: 0, stock: 0, description: '' });
      setShowAddPrize(false);
      alert(`Prize "${prize.name}" added successfully! (Demo mode)`);
    } catch (error) {
      console.error('Error adding prize:', error);
      alert('Error adding prize: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPrize = (prize) => {
    setEditingPrize({ ...prize });
    setShowAddPrize(false);
  };

  const handleUpdatePrize = async () => {
    if (!editingPrize.name || !editingPrize.barcode || !editingPrize.cost_points) {
      alert('Please fill in prize name, barcode, and cost points');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updates = {
        ...editingPrize,
        cost_points: parseInt(editingPrize.cost_points) || 0,
        points_reward: parseInt(editingPrize.points_reward) || 0,
        stock: parseInt(editingPrize.stock) || 0
      };
      
      updatePrize(editingPrize.id, updates);
      setEditingPrize(null);
      alert(`Prize updated successfully! (Demo mode)`);
    } catch (error) {
      console.error('Error updating prize:', error);
      alert('Error updating prize: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePrize = async (prizeId, prizeName) => {
    if (!window.confirm(`Are you sure you want to delete prize "${prizeName}"?`)) {
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      deletePrize(prizeId);
      alert(`Prize "${prizeName}" deleted successfully! (Demo mode)`);
    } catch (error) {
      console.error('Error deleting prize:', error);
      alert('Error deleting prize: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Item CRUD Functions
  const handleAddItem = async () => {
    if (!newItem.name || !newItem.barcode || !newItem.points_value) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const itemData = {
        ...newItem,
        points_value: parseInt(newItem.points_value) || 0
      };

      const item = addItem(itemData);
      setNewItem({ name: '', barcode: '', points_value: 0 });
      setShowAddItem(false);
      alert(`Item "${item.name}" added successfully! (Demo mode)`);
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Error adding item: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem({ ...item });
    setShowAddItem(false);
  };

  const handleUpdateItem = async () => {
    if (!editingItem.name || !editingItem.barcode || !editingItem.points_value) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updates = {
        ...editingItem,
        points_value: parseInt(editingItem.points_value) || 0
      };
      
      updateItem(editingItem.id, updates);
      setEditingItem(null);
      alert(`Item updated successfully! (Demo mode)`);
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Error updating item: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId, itemName) => {
    if (!window.confirm(`Are you sure you want to delete item "${itemName}"?`)) {
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      deleteItem(itemId);
      alert(`Item "${itemName}" deleted successfully! (Demo mode)`);
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item: ' + error.message);
    } finally {
      setLoading(false);
    }
  };



  // Point adjustment function
  const handlePointAdjustment = async () => {
    if (!pointAdjustment.points || pointAdjustment.points <= 0) {
      alert('請輸入有效的點數');
      return;
    }

    if (!pointAdjustment.reason.trim()) {
      alert('請輸入調整原因');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const adjustmentPoints = pointAdjustment.type === 'add' ? 
        parseInt(pointAdjustment.points) : 
        -parseInt(pointAdjustment.points);
      
      // Process the point adjustment
      processPointTransaction(
        selectedMemberForAdjustment.id,
        Math.abs(pointAdjustment.points),
        pointAdjustment.type === 'add' ? 'earn' : 'redeem',
        `手動調整: ${pointAdjustment.reason}`,
        selectedBranch
      );

      // Get updated member info
      const updatedMember = allMembers.find(m => m.id === selectedMemberForAdjustment.id);
      
      alert(`成功${pointAdjustment.type === 'add' ? '增加' : '扣除'} ${pointAdjustment.points} 積分！\n${updatedMember?.name} 現在有 ${updatedMember?.points} 積分。`);
      
      // Reset form and close modal
      setPointAdjustment({ points: 0, type: 'add', reason: '' });
      setShowPointAdjustment(false);
      setSelectedMemberForAdjustment(null);
    } catch (error) {
      console.error('Error adjusting points:', error);
      alert('調整積分時發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  // Account management functions
  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      alert('Please fill in all password fields');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert('New password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In demo mode, just show success
      alert('Password changed successfully! (Demo mode)');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowChangePassword(false);
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Admin password management functions
  const handleAdminChangePassword = async () => {
    if (!adminPasswordForm.newPassword || !adminPasswordForm.confirmPassword) {
      alert(t('fillAllPasswordFields'));
      return;
    }

    if (adminPasswordForm.newPassword !== adminPasswordForm.confirmPassword) {
      alert(t('passwordsDoNotMatch'));
      return;
    }

    if (adminPasswordForm.newPassword.length < 6) {
      alert(t('passwordMinLength'));
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user/member password in demo mode
      if (selectedUserForPassword.type === 'user') {
        updateUser(selectedUserForPassword.id, { password: adminPasswordForm.newPassword });
      } else {
        updateMember(selectedUserForPassword.id, { password: adminPasswordForm.newPassword });
      }
      
      alert(`${t('passwordChangedFor')} ${selectedUserForPassword.name} ${t('successfully')}! (${t('demo')})`);
      setAdminPasswordForm({ newPassword: '', confirmPassword: '' });
      setShowAdminChangePassword(false);
      setSelectedUserForPassword(null);
    } catch (error) {
      console.error('Error changing password:', error);
      alert(t('errorChangingPassword') + ': ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const openAdminPasswordChange = (user, type) => {
    setSelectedUserForPassword({ ...user, type });
    setShowAdminChangePassword(true);
  };

  // Redirect regular users to home page instead of showing access denied
  if (!isAdmin && !isSales) {
    return <Navigate to="/" replace />;
  }

  // Build tabs with role-based access control
  const allTabs = [
    { id: 'scan', name: t('redemption'), icon: '🎫' },
    { id: 'members', name: t('members'), icon: '👥' },
    { id: 'prizes', name: t('prizes'), icon: '🎁' },
    { id: 'items', name: t('items'), icon: '📦' },
    { id: 'users', name: t('users'), icon: '👤', adminOnly: true },
    { id: 'branches', name: t('branches'), icon: '🏢', adminOnly: true },
    { id: 'account', name: t('myAccount'), icon: '⚙️' },
    { id: 'settings', name: t('settings'), icon: '🔧', adminOnly: true },
  ];

  // Filter tabs based on user role - Sales users can't access Users, Branches, Settings
  const tabs = allTabs.filter(tab => !tab.adminOnly || isAdmin);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">{t('adminDashboard')} ({t('demo')})</h2>
        
        {/* Branch Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('currentBranch')}
          </label>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {isChinese ? branch.name : branch.nameEn}
              </option>
            ))}
          </select>
        </div>

        {/* Horizontal Tab Navigation - Exactly like original */}
        <div className="flex space-x-1 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-3 px-4 text-sm font-medium whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Scanner Tab */}
      {activeTab === 'scan' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">{t('qrScanner')} ({t('demo')})</h3>
            
            {/* Business Flow Steps */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">📋 {t('businessFlowSteps')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">1</span>
                  <span>{t('memberShowsQR')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">2</span>
                  <span>{t('staffScansPrize')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">3</span>
                  <span>{t('staffScansMember')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">4</span>
                  <span>{t('systemUpdates')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">5</span>
                  <span>{t('adminCanCheck')}</span>
                </div>
              </div>
            </div>

            {/* Current Step Indicator */}
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-600">📍</span>
                <span className="font-medium text-yellow-800">
                  {!scanResult ? t('step1ScanPrize') : 
                   scanResult.type === 'prize' ? t('step2ScanMember') :
                   t('step3Complete')}
                </span>
              </div>
            </div>

            {/* Scan Button */}
            <div className="text-center mb-4">
              <button
                onClick={() => {
                  if (!scanResult) {
                    // Step 1: Intelligent barcode scan - randomly pick item or prize
                    const allBarcodes = [...items.map(i => i.barcode), ...prizes.map(p => p.barcode)];
                    const randomBarcode = allBarcodes[Math.floor(Math.random() * allBarcodes.length)];
                    const recognition = recognizeBarcode(randomBarcode);
                    
                    if (recognition.type === 'prize') {
                      setScanResult({ 
                        type: 'prize',
                        barcode: recognition.data.barcode,
                        prizeId: recognition.data.id,
                        prizeName: recognition.data.name,
                        pointsReward: recognition.data.points_reward,
                        costPoints: recognition.data.cost_points,
                        recognizedAs: 'prize'
                      });
                    } else if (recognition.type === 'item') {
                      setScanResult({ 
                        type: 'item',
                        barcode: recognition.data.barcode,
                        itemId: recognition.data.id,
                        itemName: recognition.data.name,
                        pointsValue: recognition.data.points_value,
                        recognizedAs: 'item'
                      });
                    }
                    setScanType('user'); // Next step will be user scan
                  } else if ((scanResult.type === 'prize' || scanResult.type === 'item') && !scanResult.memberScanned) {
                    // Step 2: Scan member QR code
                    const randomMember = allMembers[Math.floor(Math.random() * allMembers.length)];
                    setScanResult(prev => ({ 
                      ...prev,
                      memberScanned: true,
                      userId: randomMember.id, 
                      username: randomMember.username,
                      name: randomMember.name,
                      points: randomMember.points
                    }));
                  }
                }}
                className={`px-6 py-3 rounded-lg font-medium ${
                  !scanResult 
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {!scanResult ? t('scanBarcode') : t('scanUserQR')}
              </button>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="text-4xl mb-4">📷</div>
              <p className="text-gray-600 mb-4">
                {!scanResult 
                  ? `${t('step1Instruction')}`
                  : scanResult.type === 'prize' && !scanResult.memberScanned
                  ? `${t('step2Instruction')}`
                  : `${t('readyForTransaction')}`
                }
              </p>
              
              {/* Camera Status */}
              <div className="text-sm text-gray-500">
                {!scanResult 
                  ? t('cameraReadyForPrize')
                  : scanResult.type === 'prize' && !scanResult.memberScanned
                  ? t('cameraReadyForMember')
                  : t('scanningComplete')
                }
              </div>
            </div>

            {scanResult && (
              <div className="mt-4">
                {/* Step 1: Prize Scanned */}
                {scanResult.type === 'prize' && !scanResult.memberScanned && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-3">✅ {t('step1Complete')}</h4>
                    <div className="bg-white p-3 rounded border mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{scanResult.prizeName}</p>
                          <p className="text-sm text-gray-600">{t('barcode')}: {scanResult.barcode}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-blue-600">+{scanResult.pointsReward} {t('points')}</p>
                          <p className="text-sm text-gray-500">{t('redeem')} {t('need')}: {scanResult.costPoints} {t('points')}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
                      <p className="text-sm text-green-800">
                        <strong>✅ {t('systemRecognizedPrize')}</strong><br/>
                        {t('nowScanMemberQRToChooseAction')}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-2">👤</div>
                      <p className="text-gray-600 mb-3">{t('waitingForMemberQR')}</p>
                    </div>
                  </div>
                )}

                {/* Step 2: Both Prize and Member Scanned */}
                {scanResult.type === 'prize' && scanResult.memberScanned && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-3">✅ {t('step2Complete')}</h4>
                    
                    {/* Prize Info */}
                    <div className="bg-white p-3 rounded border mb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-blue-700">🎁 {scanResult.prizeName}</p>
                          <p className="text-sm text-gray-600">{t('reward')}: +{scanResult.pointsReward} {t('points')} | {t('redeem')}: -{scanResult.costPoints} {t('points')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Member Info */}
                    <div className="bg-white p-3 rounded border mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-green-700">👤 {scanResult.name}</p>
                          <p className="text-sm text-gray-600">@{scanResult.username}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-green-600">{scanResult.points} {t('points')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Selection */}
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-800">{t('selectAction')}:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <button
                          onClick={() => {
                            // Add points for prize collection
                            handlePointTransaction(scanResult.userId, scanResult.pointsReward, 'add', `${scanResult.prizeName} (${t('prizeCollection')})`);
                          }}
                          className="p-4 border-2 border-blue-300 rounded-lg hover:bg-blue-50 text-left"
                        >
                          <div className="font-medium text-blue-700">💰 {t('addPointsForPrize')}</div>
                          <div className="text-sm text-gray-600">{t('memberGotPrizeAddPoints')}</div>
                          <div className="text-lg font-semibold text-blue-600 mt-1">+{scanResult.pointsReward} {t('points')}</div>
                        </button>
                        <button
                          onClick={() => {
                            // Redeem prize
                            if (scanResult.points >= scanResult.costPoints) {
                              handlePointTransaction(scanResult.userId, scanResult.costPoints, 'redeem', `${scanResult.prizeName} (${t('prizeRedemption')})`);
                            } else {
                              alert(`${t('insufficientPoints')}! ${t('need')} ${scanResult.costPoints} ${t('points')}, ${t('currentBalance')}: ${scanResult.points} ${t('points')}`);
                            }
                          }}
                          disabled={scanResult.points < scanResult.costPoints}
                          className={`p-4 border-2 rounded-lg text-left ${
                            scanResult.points >= scanResult.costPoints
                              ? 'border-red-300 hover:bg-red-50'
                              : 'border-gray-300 bg-gray-100 cursor-not-allowed'
                          }`}
                        >
                          <div className={`font-medium ${scanResult.points >= scanResult.costPoints ? 'text-red-700' : 'text-gray-500'}`}>
                            🏆 {t('redeemThisPrize')}
                          </div>
                          <div className="text-sm text-gray-600">{t('memberWantsThisPrize')}</div>
                          <div className={`text-lg font-semibold mt-1 ${scanResult.points >= scanResult.costPoints ? 'text-red-600' : 'text-gray-400'}`}>
                            -{scanResult.costPoints} {t('points')}
                          </div>
                          {scanResult.points < scanResult.costPoints && (
                            <div className="text-xs text-red-500 mt-1">{t('insufficientPoints')}</div>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {scanResult.type === 'user' && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-3">{t('memberScanned')}</h4>
                    <div className="bg-white p-3 rounded border mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{scanResult.name}</p>
                          <p className="text-sm text-gray-600">@{scanResult.username}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-blue-600">{scanResult.points} {t('points')}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h5 className="font-medium">{t('selectAction')}:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <button
                          onClick={() => {
                            // Show prize selection for earning points
                            setScanResult(prev => ({ ...prev, action: 'earn' }));
                          }}
                          className="p-3 border-2 border-blue-300 rounded-lg hover:bg-blue-50 text-left"
                        >
                          <div className="font-medium text-blue-700">🎁 {t('earnFromPrize')}</div>
                          <div className="text-sm text-gray-600">{t('memberGotPrize')}</div>
                        </button>
                        <button
                          onClick={() => {
                            // Show manual points addition
                            setScanResult(prev => ({ ...prev, action: 'manual' }));
                          }}
                          className="p-3 border-2 border-purple-300 rounded-lg hover:bg-purple-50 text-left"
                        >
                          <div className="font-medium text-purple-700">➕ {t('manualAdd')}</div>
                          <div className="text-sm text-gray-600">{t('eventGift')}</div>
                        </button>
                        <button
                          onClick={() => {
                            // Show prize selection for redeeming
                            setScanResult(prev => ({ ...prev, action: 'redeem' }));
                          }}
                          className="p-3 border-2 border-red-300 rounded-lg hover:bg-red-50 text-left"
                        >
                          <div className="font-medium text-red-700">🏆 {t('redeemPrize')}</div>
                          <div className="text-sm text-gray-600">{t('memberWantsPrize')}</div>
                        </button>
                      </div>
                    </div>

                    {/* Prize Selection for Earning */}
                    {scanResult.action === 'earn' && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <h6 className="font-medium mb-2">{t('selectPrizeScanned')}:</h6>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {prizes.map((prize) => (
                            <button
                              key={prize.id}
                              onClick={() => {
                                handlePointTransaction(scanResult.userId, prize.points_reward, 'add', prize.name);
                              }}
                              className="w-full p-2 text-left border border-gray-300 rounded hover:bg-white"
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-medium">{prize.name}</span>
                                <span className="text-blue-600">+{prize.points_reward} pts</span>
                              </div>
                              <div className="text-xs text-gray-500">Barcode: {prize.barcode}</div>
                            </button>
                          ))}
                        </div>
                        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                          <p className="text-xs text-yellow-800">{t('prizeEarnNote')}</p>
                        </div>
                      </div>
                    )}

                    {/* Manual Points Addition */}
                    {scanResult.action === 'manual' && (
                      <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                        <h6 className="font-medium mb-2">{t('manualPointsAddition')}:</h6>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {t('pointsToAdd')}
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="100"
                              defaultValue="5"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              id="manual-points-input"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {t('reason')}
                            </label>
                            <input
                              type="text"
                              placeholder="例：活動贈送、生日禮物"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              id="manual-reason-input"
                            />
                          </div>
                          <button
                            onClick={() => {
                              const points = parseInt(document.getElementById('manual-points-input').value) || 5;
                              const reason = document.getElementById('manual-reason-input').value || '活動贈送';
                              handlePointTransaction(scanResult.userId, points, 'add', reason);
                            }}
                            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                          >
                            {t('addPoints')}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Prize Selection for Redeeming */}
                    {scanResult.action === 'redeem' && (
                      <div className="mt-4 p-3 bg-red-50 rounded-lg">
                        <h6 className="font-medium mb-2">{t('selectPrizeToRedeem')}:</h6>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {prizes.filter(prize => prize.stock > 0).map((prize) => (
                            <button
                              key={prize.id}
                              onClick={() => {
                                if (scanResult.points >= prize.cost_points) {
                                  handlePointTransaction(scanResult.userId, prize.cost_points, 'redeem', prize.name);
                                } else {
                                  alert(`${t('insufficientPoints')} ${t('need')} ${prize.cost_points} ${t('points')}`);
                                }
                              }}
                              disabled={scanResult.points < prize.cost_points}
                              className={`w-full p-2 text-left border rounded ${
                                scanResult.points >= prize.cost_points
                                  ? 'border-gray-300 hover:bg-white'
                                  : 'border-gray-200 bg-gray-100 cursor-not-allowed'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span className={`font-medium ${scanResult.points >= prize.cost_points ? '' : 'text-gray-400'}`}>
                                  {prize.name}
                                </span>
                                <span className={`${scanResult.points >= prize.cost_points ? 'text-red-600' : 'text-gray-400'}`}>
                                  -{prize.cost_points} pts
                                </span>
                              </div>
                              <div className="text-xs text-gray-500">Stock: {prize.stock}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}



                {/* Step 1: Barcode Scanned - Item */}
                {scanResult.type === 'item' && !scanResult.memberScanned && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-3">✅ {t('step1Complete')} - {t('itemRecognized')}</h4>
                    <div className="bg-white p-3 rounded border mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{scanResult.itemName}</p>
                          <p className="text-sm text-gray-600">{t('barcode')}: {scanResult.barcode}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-green-600">+{scanResult.pointsValue} {t('points')}</p>
                          <p className="text-sm text-gray-500">{t('earnPointsForPurchase')}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                      <p className="text-sm text-blue-800">
                        <strong>✅ {t('systemRecognizedAsItem')}</strong><br/>
                        {t('memberWillEarnPointsForPurchase')}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-2">👤</div>
                      <p className="text-gray-600 mb-3">{t('waitingForMemberQR')}</p>
                    </div>
                  </div>
                )}

                {/* Step 2: Item and Member Scanned */}
                {scanResult.type === 'item' && scanResult.memberScanned && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-3">✅ {t('step2Complete')} - {t('itemPurchase')}</h4>
                    
                    {/* Item Info */}
                    <div className="bg-white p-3 rounded border mb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-green-700">📦 {scanResult.itemName}</p>
                          <p className="text-sm text-gray-600">{t('reward')}: +{scanResult.pointsValue} {t('points')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Member Info */}
                    <div className="bg-white p-3 rounded border mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-green-700">👤 {scanResult.name}</p>
                          <p className="text-sm text-gray-600">@{scanResult.username}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-green-600">{scanResult.points} {t('points')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action - Only Add Points for Items */}
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-800">{t('confirmPurchase')}:</h5>
                      <button
                        onClick={() => {
                          // Add points for item purchase
                          handlePointTransaction(scanResult.userId, scanResult.pointsValue, 'add', `${scanResult.itemName} (${t('itemPurchase')})`);
                        }}
                        className="w-full p-4 border-2 border-green-300 rounded-lg hover:bg-green-50 text-left"
                      >
                        <div className="font-medium text-green-700">💰 {t('confirmItemPurchase')}</div>
                        <div className="text-sm text-gray-600">{t('memberPurchasedItem')}</div>
                        <div className="text-lg font-semibold text-green-600 mt-1">+{scanResult.pointsValue} {t('points')}</div>
                      </button>
                    </div>
                  </div>
                )}

                {scanResult.type === 'unknown' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">{t('itemNotFound')}</h4>
                    <p className="text-red-700 mb-3">Barcode: {scanResult.barcode}</p>
                    <p className="text-sm text-gray-600 mb-3">{t('itemNotInDatabase')}</p>
                    <button
                      onClick={() => {
                        // In real app, this would open add item form with pre-filled barcode
                        alert(`${t('addNewItem')} ${t('barcode')}: ${scanResult.barcode} (${t('demo')} mode)`);
                        setScanResult(null);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      {t('addToDatabase')}
                    </button>
                  </div>
                )}

                <div className="mt-4 text-center">
                  <button
                    onClick={() => {
                      setScanResult(null);
                      setScanType('prize'); // Reset to start from prize scan
                    }}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    {t('startNewTransaction')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">{t('memberManagement')} ({t('demo')})</h3>
          
          {/* Search and Controls */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder={t('searchByName')}
                  value={memberSearchQuery}
                  onChange={(e) => {
                    setMemberSearchQuery(e.target.value);
                    setMemberCurrentPage(1); // Reset to first page on search
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10"
                />
                {memberSearchQuery && (
                  <button
                    onClick={() => {
                      setMemberSearchQuery('');
                      setMemberCurrentPage(1);
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowAllMembers(!showAllMembers)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {showAllMembers ? 'Hide All' : t('showAll')} ({allMembers.length})
              </button>
            </div>
            
            {/* Results Summary */}
            <div className="text-sm text-gray-600">
              {memberSearchQuery ? (
                <span>{filteredMembers.length} {t('results')} {t('for')} "{memberSearchQuery}"</span>
              ) : (
                <span>{t('totalMembers')}: {allMembers.length}</span>
              )}
            </div>
          </div>

          {/* Search Results */}
          {members.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Search Results</h4>
              <div className="space-y-2">
                {members.map((member) => (
                  <div key={member.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-600">@{member.username}</p>
                        <p className="text-sm text-gray-600">{member.points} points</p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <button
                          onClick={() => {
                            setSelectedMemberForHistory(member);
                            setShowMemberHistory(true);
                          }}
                          className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                        >
                          {t('viewHistory')}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedMemberForAdjustment(member);
                            setShowPointAdjustment(true);
                          }}
                          className="px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
                        >
                          {t('adjustPoints')}
                        </button>
                        <button
                          onClick={() => alert(`Editing ${member.name} (${t('demo')} mode)`)}
                          className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                        >
                          {t('edit')}
                        </button>
                        <button
                          onClick={() => openAdminPasswordChange(member, 'member')}
                          className="px-2 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700"
                        >
                          {t('changePassword')}
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member.id, member.name)}
                          className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                        >
                          {t('delete')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Members */}
          {showAllMembers && (
            <div>
              {filteredMembers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🔍</div>
                  <p>{t('noResults')}</p>
                  {memberSearchQuery && (
                    <button
                      onClick={() => {
                        setMemberSearchQuery('');
                        setMemberCurrentPage(1);
                      }}
                      className="mt-2 text-blue-600 hover:text-blue-800"
                    >
                      {t('clearSearch')}
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    {paginatedMembers.map((member) => (
                  <div key={member.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    {editingMember && editingMember.id === member.id ? (
                      // Edit Form
                      <div>
                        <h4 className="font-medium text-gray-900 mb-4">{t('editMember')}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {t('username')} *
                            </label>
                            <input
                              type="text"
                              value={editingMember.username}
                              onChange={(e) => setEditingMember(prev => ({ ...prev, username: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {t('fullName')} *
                            </label>
                            <input
                              type="text"
                              value={editingMember.name}
                              onChange={(e) => setEditingMember(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {t('email')} *
                            </label>
                            <input
                              type="email"
                              value={editingMember.email}
                              onChange={(e) => setEditingMember(prev => ({ ...prev, email: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {t('phone')}
                            </label>
                            <input
                              type="text"
                              value={editingMember.phone}
                              onChange={(e) => setEditingMember(prev => ({ ...prev, phone: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {t('points')}
                            </label>
                            <input
                              type="number"
                              value={editingMember.points}
                              onChange={(e) => setEditingMember(prev => ({ ...prev, points: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {t('gender')}
                            </label>
                            <select
                              value={editingMember.gender}
                              onChange={(e) => setEditingMember(prev => ({ ...prev, gender: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            >
                              <option value="male">{t('male')}</option>
                              <option value="female">{t('female')}</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {t('password')}
                            </label>
                            <input
                              type="password"
                              value={editingMember.password || ''}
                              onChange={(e) => setEditingMember(prev => ({ ...prev, password: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              placeholder="Leave blank to keep current password"
                            />
                          </div>
                        </div>
                        <div className="flex space-x-3 mt-4">
                          <button
                            onClick={handleUpdateMember}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                          >
                            {loading ? t('saving') : t('update')}
                          </button>
                          <button
                            onClick={() => setEditingMember(null)}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                          >
                            {t('cancel')}
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Display Mode
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-gray-600">@{member.username}</p>
                          <p className="text-sm text-gray-600">{member.points} {t('points')}</p>
                          <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          <button
                            onClick={() => {
                              setSelectedMemberForHistory(member);
                              setShowMemberHistory(true);
                            }}
                            className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                          >
                            {t('viewHistory')}
                          </button>
                          <button
                            onClick={() => {
                              setSelectedMemberForAdjustment(member);
                              setShowPointAdjustment(true);
                            }}
                            className="px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
                          >
                            {t('adjustPoints')}
                          </button>
                          <button
                            onClick={() => handleEditMember(member)}
                            className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                          >
                            {t('edit')}
                          </button>
                          <button
                            onClick={() => openAdminPasswordChange(member, 'member')}
                            className="px-2 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700"
                          >
                            {t('changePassword')}
                          </button>
                          <button
                            onClick={() => handleDeleteMember(member.id, member.name)}
                            className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                          >
                            {t('delete')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  <PaginationControls
                    currentPage={memberCurrentPage}
                    totalPages={memberTotalPages}
                    onPageChange={setMemberCurrentPage}
                    dataType="members"
                    t={t}
                    filteredMembers={filteredMembers}
                    filteredPrizes={filteredPrizes}
                    filteredItems={filteredItems}
                    ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                  />
                </>
              )}
            </div>
          )}

          {/* Add New Member Form */}
          {!showAddMember && !editingMember ? (
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <button
                onClick={() => setShowAddMember(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                + {t('addMember')}
              </button>
            </div>
          ) : showAddMember && (
            <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-4">{t('addMember')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('username')} *
                  </label>
                  <input
                    type="text"
                    value={newMember.username}
                    onChange={(e) => setNewMember(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="john_doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('fullName')} *
                  </label>
                  <input
                    type="text"
                    value={newMember.name}
                    onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('email')} *
                  </label>
                  <input
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('phone')}
                  </label>
                  <input
                    type="text"
                    value={newMember.phone}
                    onChange={(e) => setNewMember(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="+1234567890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('initialPoints')}
                  </label>
                  <input
                    type="number"
                    value={newMember.points}
                    onChange={(e) => setNewMember(prev => ({ ...prev, points: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('gender')}
                  </label>
                  <select
                    value={newMember.gender}
                    onChange={(e) => setNewMember(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="male">{t('male')}</option>
                    <option value="female">{t('female')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('password')} *
                  </label>
                  <input
                    type="password"
                    value={newMember.password}
                    onChange={(e) => setNewMember(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter login password"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={handleAddMember}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? t('saving') : t('save')}
                </button>
                <button
                  onClick={() => {
                    setShowAddMember(false);
                    setNewMember({ username: '', name: '', email: '', phone: '', points: 0, gender: 'male', birthday: '', password: '' });
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  {t('cancel')}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Prizes Tab */}
      {activeTab === 'prizes' && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">{t('prizeManagement')} ({t('demo')})</h3>
          
          {/* Search and Add Prize */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder={t('searchPrizes')}
                value={prizeSearchQuery}
                onChange={(e) => {
                  setPrizeSearchQuery(e.target.value);
                  setPrizeCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              onClick={() => setShowAddPrize(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 whitespace-nowrap"
            >
              {t('addPrize')}
            </button>
          </div>

          {/* Prizes List */}
          <div className="space-y-4">
            {paginatedPrizes.map((prize) => (
              <div key={prize.id} className="p-4 border border-gray-200 rounded-lg">
                {editingPrize && editingPrize.id === prize.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('prizeName')} *
                        </label>
                        <input
                          type="text"
                          value={editingPrize.name}
                          onChange={(e) => setEditingPrize(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('barcode')} *
                        </label>
                        <input
                          type="text"
                          value={editingPrize.barcode}
                          onChange={(e) => setEditingPrize(prev => ({ ...prev, barcode: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('costPoints')} *
                        </label>
                        <input
                          type="number"
                          value={editingPrize.cost_points}
                          onChange={(e) => setEditingPrize(prev => ({ ...prev, cost_points: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('stock')}
                        </label>
                        <input
                          type="number"
                          value={editingPrize.stock}
                          onChange={(e) => setEditingPrize(prev => ({ ...prev, stock: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('description')}
                        </label>
                        <textarea
                          value={editingPrize.description}
                          onChange={(e) => setEditingPrize(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          rows="2"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleUpdatePrize}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        {loading ? t('updating') : t('updatePrize')}
                      </button>
                      <button
                        onClick={() => setEditingPrize(null)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                      >
                        {t('cancel')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">{prize.name}</h4>
                      <p className="text-sm text-gray-600">{t('barcode')}: {prize.barcode}</p>
                      <p className="text-sm text-gray-600">{t('cost')}: {prize.cost_points} {t('points')}</p>
                      <p className="text-sm text-gray-600">{t('stock')}: {prize.stock}</p>
                      {prize.description && (
                        <p className="text-sm text-gray-500 mt-1">{prize.description}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditPrize(prize)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        {t('edit')}
                      </button>
                      <button
                        onClick={() => handleDeletePrize(prize.id, prize.name)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                      >
                        {t('delete')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          <PaginationControls
            currentPage={prizeCurrentPage}
            totalPages={prizeTotalPages}
            onPageChange={setPrizeCurrentPage}
            dataType="prizes"
            t={t}
            filteredMembers={filteredMembers}
            filteredPrizes={filteredPrizes}
            filteredItems={filteredItems}
            ITEMS_PER_PAGE={ITEMS_PER_PAGE}
          />

          {/* Add Prize Modal */}
          {showAddPrize && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{t('addNewPrize')}</h3>
                  <button
                    onClick={() => {
                      setShowAddPrize(false);
                      setNewPrize({ name: '', barcode: '', cost_points: 0, points_reward: 0, stock: 0, description: '' });
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('prizeName')} *
                      </label>
                      <input
                        type="text"
                        value={newPrize.name}
                        onChange={(e) => setNewPrize(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder={t('enterPrizeName')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('barcode')} *
                      </label>
                      <input
                        type="text"
                        value={newPrize.barcode}
                        onChange={(e) => setNewPrize(prev => ({ ...prev, barcode: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="2001001001001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('costPoints')} *
                      </label>
                      <input
                        type="number"
                        value={newPrize.cost_points}
                        onChange={(e) => setNewPrize(prev => ({ ...prev, cost_points: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('stock')}
                      </label>
                      <input
                        type="number"
                        value={newPrize.stock}
                        onChange={(e) => setNewPrize(prev => ({ ...prev, stock: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="50"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('description')}
                      </label>
                      <textarea
                        value={newPrize.description}
                        onChange={(e) => setNewPrize(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        rows="3"
                        placeholder={t('enterPrizeDescription')}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-gray-200 flex space-x-3">
                  <button
                    onClick={handleAddPrize}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? t('adding') : t('addPrize')}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddPrize(false);
                      setNewPrize({ name: '', barcode: '', cost_points: 0, points_reward: 0, stock: 0, description: '' });
                    }}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    {t('cancel')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Items Tab */}
      {activeTab === 'items' && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">{t('itemManagement')} ({t('demo')})</h3>
          
          {/* Search and Add Item */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder={t('searchItems')}
                value={itemSearchQuery}
                onChange={(e) => {
                  setItemSearchQuery(e.target.value);
                  setItemCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              onClick={() => setShowAddItem(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 whitespace-nowrap"
            >
              {t('addItem')}
            </button>
          </div>

          {/* Items List */}
          <div className="space-y-4">
            {paginatedItems.map((item) => (
              <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                {editingItem && editingItem.id === item.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('itemName')} *
                        </label>
                        <input
                          type="text"
                          value={editingItem.name}
                          onChange={(e) => setEditingItem(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('barcode')} *
                        </label>
                        <input
                          type="text"
                          value={editingItem.barcode}
                          onChange={(e) => setEditingItem(prev => ({ ...prev, barcode: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('pointsValue')} *
                        </label>
                        <input
                          type="number"
                          value={editingItem.points_value}
                          onChange={(e) => setEditingItem(prev => ({ ...prev, points_value: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleUpdateItem}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        {loading ? t('updating') : t('updateItem')}
                      </button>
                      <button
                        onClick={() => setEditingItem(null)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                      >
                        {t('cancel')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-gray-600">{t('barcode')}: {item.barcode}</p>
                      <p className="text-sm text-gray-600">{t('pointsValue')}: {item.points_value} {t('points')}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        {t('edit')}
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id, item.name)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                      >
                        {t('delete')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          <PaginationControls
            currentPage={itemCurrentPage}
            totalPages={itemTotalPages}
            onPageChange={setItemCurrentPage}
            dataType="items"
            t={t}
            filteredMembers={filteredMembers}
            filteredPrizes={filteredPrizes}
            filteredItems={filteredItems}
            ITEMS_PER_PAGE={ITEMS_PER_PAGE}
          />

          {/* Add Item Modal */}
          {showAddItem && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{t('addNewItem')}</h3>
                  <button
                    onClick={() => {
                      setShowAddItem(false);
                      setNewItem({ name: '', barcode: '', points_value: 0 });
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('itemName')} *
                      </label>
                      <input
                        type="text"
                        value={newItem.name}
                        onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder={t('enterItemName')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('barcode')} *
                      </label>
                      <input
                        type="text"
                        value={newItem.barcode}
                        onChange={(e) => setNewItem(prev => ({ ...prev, barcode: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="1001001001001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('pointsValue')} *
                      </label>
                      <input
                        type="number"
                        value={newItem.points_value}
                        onChange={(e) => setNewItem(prev => ({ ...prev, points_value: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="15"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-gray-200 flex space-x-3">
                  <button
                    onClick={handleAddItem}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? t('adding') : t('addItem')}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddItem(false);
                      setNewItem({ name: '', barcode: '', points_value: 0 });
                    }}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    {t('cancel')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Users Tab (Admin Only) */}
      {activeTab === 'users' && canManageUsers && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">{t('userManagement')} ({t('demo')})</h3>
          
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="p-4 border border-gray-200 rounded-lg">
                {editingUser && editingUser.id === user.id ? (
                  // Edit Form
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">{t('editUser')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('username')} *
                        </label>
                        <input
                          type="text"
                          value={editingUser.username}
                          onChange={(e) => setEditingUser(prev => ({ ...prev, username: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('fullName')} *
                        </label>
                        <input
                          type="text"
                          value={editingUser.name}
                          onChange={(e) => setEditingUser(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('email')} *
                        </label>
                        <input
                          type="email"
                          value={editingUser.email}
                          onChange={(e) => setEditingUser(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('userRole')} *
                        </label>
                        <select
                          value={editingUser.role}
                          onChange={(e) => setEditingUser(prev => ({ ...prev, role: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="sales">{t('sales')}</option>
                          <option value="admin">{t('admin')}</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex space-x-3 mt-4">
                      <button
                        onClick={handleUpdateUser}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        {loading ? t('saving') : t('update')}
                      </button>
                      <button
                        onClick={() => setEditingUser(null)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                      >
                        {t('cancel')}
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">@{user.username}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {t(user.role)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        {t('edit')}
                      </button>
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                        >
                          {t('delete')}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Add New User Form */}
            {!showAddUser && !editingUser ? (
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <button
                  onClick={() => setShowAddUser(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  + {t('addUser')}
                </button>
              </div>
            ) : showAddUser && (
              <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                <h4 className="font-medium text-gray-900 mb-4">{t('addUser')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('username')} *
                    </label>
                    <input
                      type="text"
                      value={newUser.username}
                      onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="salesuser1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('fullName')} *
                    </label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Sales User"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('email')} *
                    </label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="sales@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('userRole')} *
                    </label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="sales">{t('sales')}</option>
                      <option value="admin">{t('admin')}</option>
                    </select>
                  </div>
                </div>
                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={handleAddUser}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? t('saving') : t('save')}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddUser(false);
                      setNewUser({ username: '', name: '', email: '', role: 'sales', password: '' });
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    {t('cancel')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Branches Tab (Admin Only) */}
      {activeTab === 'branches' && isAdmin && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">{t('branchManagement')} ({t('demo')})</h3>
          
          <div className="space-y-4">
            {settings.branches?.map((branch) => (
              <div key={branch.id} className="p-4 border border-gray-200 rounded-lg">
                {editingBranch && editingBranch.id === branch.id ? (
                  // Edit Form
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">{t('editBranch')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('branchName')} *
                        </label>
                        <input
                          type="text"
                          value={editingBranch.name}
                          onChange={(e) => setEditingBranch(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('branchLocation')} *
                        </label>
                        <input
                          type="text"
                          value={editingBranch.location}
                          onChange={(e) => setEditingBranch(prev => ({ ...prev, location: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('whatsappNumber')}
                        </label>
                        <input
                          type="text"
                          value={editingBranch.whatsapp}
                          onChange={(e) => setEditingBranch(prev => ({ ...prev, whatsapp: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('phoneNumber2')}
                        </label>
                        <input
                          type="text"
                          value={editingBranch.phone}
                          onChange={(e) => setEditingBranch(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-3 mt-4">
                      <button
                        onClick={handleUpdateBranch}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        {loading ? t('saving') : t('update')}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                      >
                        {t('cancel')}
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-900">{branch.name}</p>
                        <p className="text-sm text-gray-600">{branch.location}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">WhatsApp:</span> {branch.whatsapp || 'N/A'}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">{t('phone')}:</span> {branch.phone || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleEditBranch(branch)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        {t('edit')}
                      </button>
                      <button
                        onClick={() => handleDeleteBranch(branch.id, branch.name)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                      >
                        {t('delete')}
                      </button>
                      <button
                        onClick={() => alert(`${t('analytics')} ${branch.name} (${t('demo')} mode)`)}
                        className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                      >
                        {t('analytics')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Add New Branch Form */}
            {!showAddBranch && !editingBranch ? (
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <button
                  onClick={() => setShowAddBranch(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  + {t('addNewBranch')}
                </button>
              </div>
            ) : (
              <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                <h4 className="font-medium text-gray-900 mb-4">{t('addNewBranch')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('branchName')} *
                    </label>
                    <input
                      type="text"
                      value={newBranch.name}
                      onChange={(e) => {
                        console.log('Name changed:', e.target.value);
                        setNewBranch(prev => ({ ...prev, name: e.target.value }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Downtown Branch"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('branchLocation')} *
                    </label>
                    <input
                      type="text"
                      value={newBranch.location}
                      onChange={(e) => {
                        console.log('Location changed:', e.target.value);
                        setNewBranch(prev => ({ ...prev, location: e.target.value }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="123 Main St, Downtown"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('whatsappNumber')}
                    </label>
                    <input
                      type="text"
                      value={newBranch.whatsapp}
                      onChange={(e) => setNewBranch(prev => ({ ...prev, whatsapp: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="+852 9876 5432"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('phoneNumber2')}
                    </label>
                    <input
                      type="text"
                      value={newBranch.phone}
                      onChange={(e) => setNewBranch(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="+852 2345 6789"
                    />
                  </div>
                </div>
                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={handleAddBranch}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? t('saving') : t('save')}
                  </button>
                  <button
                    onClick={handleCancelAddBranch}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    {t('cancel')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* My Account Tab */}
      {activeTab === 'account' && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">{t('myAccount')} ({t('demo')})</h3>
          
          {/* Current User Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">{t('accountInfo')}</h4>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">{t('username')}:</span> {userRole === 'admin' ? 'demoadmin' : 'demosales'}</p>
              <p><span className="font-medium">{t('fullName')}:</span> {userRole === 'admin' ? 'Demo Admin' : 'Demo Sales'}</p>
              <p><span className="font-medium">{t('email')}:</span> {userRole === 'admin' ? 'admin@example.com' : 'sales@example.com'}</p>
              <p><span className="font-medium">{t('userRole')}:</span> 
                <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  userRole === 'admin' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {t(userRole)}
                </span>
              </p>
            </div>
          </div>

          {/* Password Management */}
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h4 className="font-medium text-gray-900 mb-2">{t('security')}</h4>
              <p className="text-sm text-gray-600 mb-4">{t('passwordManagement')}</p>
              
              {!showChangePassword ? (
                <button
                  onClick={() => setShowChangePassword(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {t('changePassword')}
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('currentPassword')} *
                    </label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('newPassword')} *
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Enter new password (min 6 characters)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('confirmPassword')} *
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleChangePassword}
                      disabled={loading}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {loading ? t('updating') : t('updatePassword')}
                    </button>
                    <button
                      onClick={() => {
                        setShowChangePassword(false);
                        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                      {t('cancel')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Account Actions */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">{t('accountActions')}</h4>
              <div className="space-y-2">
                <button
                  onClick={() => alert(`${t('profileUpdated')} (${t('demo')} mode)`)}
                  className="w-full text-left px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <span>{t('updateProfile')}</span>
                    <span className="text-gray-400">→</span>
                  </div>
                </button>
                <button
                  onClick={() => alert(`${t('sessionRefreshed')} (${t('demo')} mode)`)}
                  className="w-full text-left px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <span>{t('refreshSession')}</span>
                    <span className="text-gray-400">→</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab (Admin Only) */}
      {activeTab === 'settings' && isAdmin && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">{t('systemSettings')} ({t('demo')})</h3>
          
          <div className="space-y-6">
            {/* AI Chatbot Settings */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{t('aiChatbot')}</h4>
                  <p className="text-sm text-gray-600">
                    {t('enableChatbot')}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.chatbot_enabled || false}
                    onChange={(e) => updateSettings({ chatbot_enabled: e.target.checked })}
                    className="sr-only peer"
                    disabled={loading}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              <div className="text-xs text-gray-500">
                When enabled, users will see the "智能客服" button in their Profile page
              </div>
            </div>

            {/* WhatsApp Integration Settings */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{t('whatsappIntegration')}</h4>
                  <p className="text-sm text-gray-600">
                    {t('enableWhatsapp')}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.whatsapp_integration_enabled || false}
                    onChange={(e) => updateSettings({ whatsapp_integration_enabled: e.target.checked })}
                    className="sr-only peer"
                    disabled={loading}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              <div className="text-xs text-gray-500">
                Requires Twilio WhatsApp Business Account setup
              </div>
            </div>

            {/* Instagram Integration Settings */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{t('instagramIntegration')}</h4>
                  <p className="text-sm text-gray-600">
                    {t('enableInstagram')}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.instagram_integration_enabled || false}
                    onChange={(e) => updateSettings({ instagram_integration_enabled: e.target.checked })}
                    className="sr-only peer"
                    disabled={loading}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              <div className="text-xs text-gray-500">
                Requires Facebook Developer Account and Instagram Business Account
              </div>
            </div>

            {/* Settings Status */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">{t('currentConfig')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${settings.chatbot_enabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>{t('aiChatbot')}: {settings.chatbot_enabled ? t('enabled') : t('disabled')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${settings.whatsapp_integration_enabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>WhatsApp: {settings.whatsapp_integration_enabled ? t('enabled') : t('disabled')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${settings.instagram_integration_enabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>Instagram: {settings.instagram_integration_enabled ? t('enabled') : t('disabled')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Member History Modal */}
      {showMemberHistory && selectedMemberForHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{selectedMemberForHistory.name} - {t('transactionHistory')}</h3>
                <p className="text-sm text-gray-600">
                  {t('currentPoints')}: {selectedMemberForHistory.points} | @{selectedMemberForHistory.username}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowMemberHistory(false);
                  setSelectedMemberForHistory(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-96">
              {(() => {
                const memberTransactions = getMemberTransactions(selectedMemberForHistory.id);
                
                if (memberTransactions.length === 0) {
                  return (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">📊</div>
                      <p>{t('noTransactions')}</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-3">
                    {memberTransactions.map((transaction) => (
                      <div key={transaction.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                transaction.type === 'earn' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {transaction.type === 'earn' ? t('earned') : t('redeemed')}
                              </span>
                              <span className="text-sm text-gray-500">
                                {new Date(transaction.timestamp).toLocaleDateString()} {new Date(transaction.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <h4 className="font-medium text-gray-900 mt-1">{transaction.itemName}</h4>
                          </div>
                          <div className="text-right">
                            <span className={`text-lg font-semibold ${
                              transaction.points > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.points > 0 ? '+' : ''}{transaction.points} {t('points')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between text-sm">
                <span>{t('totalTransactions')}: {getMemberTransactions(selectedMemberForHistory.id).length}</span>
                <span>{t('currentBalance')}: {selectedMemberForHistory.points} {t('points')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Point Adjustment Modal */}
      {showPointAdjustment && selectedMemberForAdjustment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{t('adjustMemberPoints')}</h3>
                <p className="text-sm text-gray-600">
                  {selectedMemberForAdjustment.name} (@{selectedMemberForAdjustment.username})
                </p>
                <p className="text-sm text-gray-500">
                  {t('currentPoints')}: {selectedMemberForAdjustment.points} {t('points')}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowPointAdjustment(false);
                  setSelectedMemberForAdjustment(null);
                  setPointAdjustment({ points: 0, type: 'add', reason: '' });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {/* Adjustment Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('adjustmentType')}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPointAdjustment(prev => ({ ...prev, type: 'add' }))}
                      className={`p-3 border-2 rounded-lg text-left ${
                        pointAdjustment.type === 'add'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 hover:border-green-300'
                      }`}
                    >
                      <div className="font-medium text-green-700">➕ {t('addPoints')}</div>
                      <div className="text-sm text-gray-600">{t('increasePoints')}</div>
                    </button>
                    <button
                      onClick={() => setPointAdjustment(prev => ({ ...prev, type: 'subtract' }))}
                      className={`p-3 border-2 rounded-lg text-left ${
                        pointAdjustment.type === 'subtract'
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 hover:border-red-300'
                      }`}
                    >
                      <div className="font-medium text-red-700">➖ {t('subtractPoints')}</div>
                      <div className="text-sm text-gray-600">{t('decreasePoints')}</div>
                    </button>
                  </div>
                </div>

                {/* Points Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('pointsAmount')} *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={pointAdjustment.points}
                    onChange={(e) => setPointAdjustment(prev => ({ ...prev, points: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="輸入點數"
                  />
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('adjustmentReason')} *
                  </label>
                  <input
                    type="text"
                    value={pointAdjustment.reason}
                    onChange={(e) => setPointAdjustment(prev => ({ ...prev, reason: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="例：生日禮物、活動贈送、系統錯誤修正"
                  />
                </div>

                {/* Preview */}
                {pointAdjustment.points > 0 && (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>{t('preview')}:</strong><br/>
                      {selectedMemberForAdjustment.name} 的積分將從 {selectedMemberForAdjustment.points} 
                      {pointAdjustment.type === 'add' ? ' 增加到 ' : ' 減少到 '}
                      {pointAdjustment.type === 'add' 
                        ? selectedMemberForAdjustment.points + parseInt(pointAdjustment.points || 0)
                        : selectedMemberForAdjustment.points - parseInt(pointAdjustment.points || 0)
                      } 積分
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handlePointAdjustment}
                    disabled={loading || !pointAdjustment.points || !pointAdjustment.reason.trim()}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? t('processing') : t('confirmAdjustment')}
                  </button>
                  <button
                    onClick={() => {
                      setShowPointAdjustment(false);
                      setSelectedMemberForAdjustment(null);
                      setPointAdjustment({ points: 0, type: 'add', reason: '' });
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    {t('cancel')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Password Change Modal */}
      {showAdminChangePassword && selectedUserForPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {t('changePasswordFor')} {selectedUserForPassword.name}
              </h3>
              <button
                onClick={() => {
                  setShowAdminChangePassword(false);
                  setSelectedUserForPassword(null);
                  setAdminPasswordForm({ newPassword: '', confirmPassword: '' });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                {t('adminPasswordChangeNote')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('newPassword')} *
                </label>
                <input
                  type="password"
                  value={adminPasswordForm.newPassword}
                  onChange={(e) => setAdminPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder={t('enterNewPassword')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('confirmNewPassword')} *
                </label>
                <input
                  type="password"
                  value={adminPasswordForm.confirmPassword}
                  onChange={(e) => setAdminPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder={t('confirmNewPassword')}
                />
              </div>

              <div className="text-sm text-gray-600">
                {t('passwordRequirements')}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 flex space-x-3">
              <button
                onClick={handleAdminChangePassword}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? t('changing') : t('changePassword')}
              </button>
              <button
                onClick={() => {
                  setShowAdminChangePassword(false);
                  setSelectedUserForPassword(null);
                  setAdminPasswordForm({ newPassword: '', confirmPassword: '' });
                }}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;