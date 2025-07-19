import React from "react";

function AddTransactionForm({postTransaction}) {
  function submitForm(e){
    e.preventDefault()
    const form = e.target;
    const newTransaction = {
      date: form.elements.date.value,
      description: form.elements.description.value,
      category: form.elements.category.value,
      amount: form.elements.amount.value
    }
    postTransaction(newTransaction)
    form.reset();
  }

  return (
    <div className="ui segment">
      <form className="ui form" onSubmit={(e)=>{submitForm(e)}}>
        <div className="inline fields">
          <input type="date" name="date" data-testid="date-input" />
          <input type="text" name="description" placeholder="Description" />
          <input type="text" name="category" placeholder="Category" />
          <input type="number" name="amount" placeholder="Amount" step="0.01" />
        </div>
        <button className="ui button" type="submit">
          Add Transaction
        </button>
      </form>
    </div>
  );
}

export default AddTransactionForm;
