import React, {useState, useEffect} from "react";
import TransactionsList from "./TransactionsList";
import Search from "./Search";
import AddTransactionForm from "./AddTransactionForm";
import Sort from "./Sort";

function AccountContainer() {
  const [transactions,setTransactions] = useState([])
  const [search,setSearch] = useState("")
  // console.log(search)

  useEffect(()=>{
    fetch("http://localhost:6001/transactions")
    .then(r=>r.json())
    .then(data=>setTransactions(data))
  },[])

  function postTransaction(newTransaction){
    fetch('http://localhost:6001/transactions',{
      method: "POST",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newTransaction)
    })
    .then(r=>r.json())
    .then(data=>setTransactions(prev => [...prev,data]))
  }
  
  // Sort function here
  function onSort(sortBy){
    const sorted = [...transactions].sort((a, b) => {
      const A = a[sortBy].toString().toLowerCase()
      const B = b[sortBy].toString().toLowerCase()
      return A.localeCompare(B)
    });
    setTransactions(sorted);
  }

  const filteredTransactions = transactions.filter(txn =>
    txn.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Search setSearch={setSearch}/>
      <AddTransactionForm postTransaction={postTransaction}/>
      <Sort onSort={onSort}/>
      <TransactionsList transactions={filteredTransactions} />
    </div>
  );
}

export default AccountContainer;
