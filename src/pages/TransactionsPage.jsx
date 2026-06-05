import { useMemo, useState } from 'react';
import { useApp } from '../hooks/useApp.js';
import { useAuth } from '../hooks/useAuth.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { Loading } from '../components/common/Loading.jsx';
import { Button } from '../components/common/Button.jsx';
import { Modal } from '../components/common/Modal.jsx';
import { Pagination } from '../components/common/Pagination.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { TransactionForm } from '../components/features/transactions/TransactionForm.jsx';
import { TransactionRow } from '../components/features/transactions/TransactionRow.jsx';
import { TransactionFilters } from '../components/features/transactions/TransactionFilters.jsx';
import {
  filterTransactions,
  paginate,
  pageCount,
  availableMonths,
  transactionsToCSV,
} from '../utils/helpers.js';
import { PAGE_SIZE } from '../utils/constants.js';

const DEFAULT_FILTERS = {
  search: '',
  type: 'all',
  category: 'all',
  month: 'all',
};

export default function TransactionsPage() {
  const { user } = useAuth();
  const { status, transactions, deleteTransaction } = useApp();
  const currency = user?.currency || 'USD';

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null); // { mode: 'add'|'edit', tx? }
  const [pendingDelete, setPendingDelete] = useState(null);

  // Debounce only the search term so typing stays smooth.
  const debouncedSearch = useDebounce(filters.search, 250);

  const months = useMemo(() => availableMonths(transactions), [transactions]);

  const filtered = useMemo(
    () =>
      filterTransactions(transactions, {
        ...filters,
        search: debouncedSearch,
      }),
    [transactions, filters, debouncedSearch]
  );

  const totalPages = pageCount(filtered.length, PAGE_SIZE);
  const safePage = Math.min(page, totalPages);
  const pageItems = useMemo(
    () => paginate(filtered, safePage, PAGE_SIZE),
    [filtered, safePage]
  );

  const handleFilterChange = (next) => {
    setFilters(next);
    setPage(1);
  };

  const exportCSV = () => {
    const csv = transactionsToCSV(filtered);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fintrack-transactions.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const confirmDelete = () => {
    if (pendingDelete) deleteTransaction(pendingDelete.id);
    setPendingDelete(null);
  };

  if (status === 'loading' || status === 'idle') {
    return <Loading label="Loading transactions…" />;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Transactions</h1>
          <p>
            {filtered.length} of {transactions.length} shown
          </p>
        </div>
        <div className="header-actions">
          <Button
            variant="secondary"
            onClick={exportCSV}
            disabled={filtered.length === 0}
          >
            Export CSV
          </Button>
          <Button onClick={() => setModal({ mode: 'add' })}>
            + Add transaction
          </Button>
        </div>
      </div>

      <div className="card">
        <TransactionFilters
          filters={filters}
          onChange={handleFilterChange}
          months={months}
        />
      </div>

      <div className="card" style={{ marginTop: 'var(--space-3)' }}>
        {pageItems.length === 0 ? (
          <EmptyState
            title="No transactions found"
            message="Try adjusting your filters, or add a new transaction."
          />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <caption className="sr-only">Your transactions</caption>
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Description</th>
                  <th scope="col">Category</th>
                  <th scope="col">Account</th>
                  <th scope="col" className="num">
                    Amount
                  </th>
                  <th scope="col" className="num">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((t) => (
                  <TransactionRow
                    key={t.id}
                    transaction={t}
                    currency={currency}
                    onEdit={(tx) => setModal({ mode: 'edit', tx })}
                    onDelete={(tx) => setPendingDelete(tx)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          page={safePage}
          totalPages={totalPages}
          onChange={setPage}
        />
      </div>

      <Modal
        isOpen={Boolean(modal)}
        onClose={() => setModal(null)}
        title={modal?.mode === 'edit' ? 'Edit transaction' : 'Add transaction'}
      >
        <TransactionForm initial={modal?.tx} onDone={() => setModal(null)} />
      </Modal>

      <Modal
        isOpen={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title="Delete transaction?"
      >
        <p>
          Delete &ldquo;{pendingDelete?.description}&rdquo;? This cannot be
          undone.
        </p>
        <div className="form-actions">
          <Button variant="secondary" onClick={() => setPendingDelete(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
