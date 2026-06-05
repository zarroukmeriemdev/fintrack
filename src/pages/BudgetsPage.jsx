import { useMemo, useState } from 'react';
import { useApp } from '../hooks/useApp.js';
import { useAuth } from '../hooks/useAuth.js';
import { Loading } from '../components/common/Loading.jsx';
import { Button } from '../components/common/Button.jsx';
import { Modal } from '../components/common/Modal.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { BudgetForm } from '../components/features/budgets/BudgetForm.jsx';
import { BudgetCard } from '../components/features/budgets/BudgetCard.jsx';
import { budgetProgress, totalExpense } from '../utils/helpers.js';
import { formatCurrency } from '../utils/formatters.js';

export default function BudgetsPage() {
  const { user } = useAuth();
  const { status, budgets, transactions, deleteBudget } = useApp();
  const currency = user?.currency || 'USD';

  const [modal, setModal] = useState(null); // { mode, budget? }
  const [pendingDelete, setPendingDelete] = useState(null);

  const progress = useMemo(
    () => budgetProgress(budgets, transactions),
    [budgets, transactions]
  );

  const totals = useMemo(() => {
    const limit = budgets.reduce((sum, b) => sum + b.limit, 0);
    const spent = totalExpense(transactions);
    return { limit, spent };
  }, [budgets, transactions]);

  const confirmDelete = () => {
    if (pendingDelete) deleteBudget(pendingDelete.id);
    setPendingDelete(null);
  };

  if (status === 'loading' || status === 'idle') {
    return <Loading label="Loading budgets…" />;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Budgets</h1>
          <p>
            {formatCurrency(totals.spent, currency)} spent of{' '}
            {formatCurrency(totals.limit, currency)} budgeted
          </p>
        </div>
        <Button onClick={() => setModal({ mode: 'add' })}>+ Add budget</Button>
      </div>

      {progress.length === 0 ? (
        <div className="card">
          <EmptyState
            title="No budgets yet"
            message="Create a budget to start tracking your spending limits."
            action={
              <Button onClick={() => setModal({ mode: 'add' })}>
                Create your first budget
              </Button>
            }
          />
        </div>
      ) : (
        <div className="budget-grid">
          {progress.map((b) => (
            <BudgetCard
              key={b.id}
              budget={b}
              currency={currency}
              onEdit={(budget) => setModal({ mode: 'edit', budget })}
              onDelete={(budget) => setPendingDelete(budget)}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={Boolean(modal)}
        onClose={() => setModal(null)}
        title={modal?.mode === 'edit' ? 'Edit budget' : 'Add budget'}
      >
        <BudgetForm initial={modal?.budget} onDone={() => setModal(null)} />
      </Modal>

      <Modal
        isOpen={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title="Delete budget?"
      >
        <p>Delete the {pendingDelete?.category} budget?</p>
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
