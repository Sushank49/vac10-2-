import { Children, useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
  }

  function handleSelection(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />

        {showAddFriend && (
          <FormAddFriend
            onAddFriend={handleAddFriend}
            showAddFriend={setShowAddFriend}
          ></FormAddFriend>
        )}

        <Button onClick={() => setShowAddFriend(!showAddFriend)}>
          {!showAddFriend ? "Add friend" : "Close"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill friend={selectedFriend}></FormSplitBill>
      )}
    </div>
  );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        ></Friend>
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name}></img>
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && (
        <p className="">You and {friend.name} are even</p>
      )}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend, showAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    const id = crypto.randomUUID();
    e.preventDefault();

    if (!name || !image) return;
    const friend = { name, image: `${image}?=${id}`, id, balance: 0 };
    onAddFriend(friend);
    setName("");
    setImage("https://i.pravatar.cc/48");
    showAddFriend(false);
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑‍🤝‍🧑Friend Name *</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>

      <label>🖼️ Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      ></input>

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ friend }) {
  const [bill, setBill] = useState("");
  const [me, setMe] = useState("");
  const paidByFriend = bill ? bill - me : "";
  const [paying, setPaying] = useState("user");

  return (
    <form className="form-split-bill">
      <h2>Split a bill with {friend.name}</h2>
      <label>💰 Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      ></input>

      <label>🕴️ Your expense</label>
      <input
        type="text"
        value={me}
        onChange={(e) =>
          setMe(Number(e.target.value) > bill ? me : Number(e.target.value))
        }
      ></input>

      <label>🧑‍🤝‍🧑 {friend.name}'s expense</label>
      <input type="text" disabled value={paidByFriend}></input>

      <label>💵 Who is paying the bill</label>
      <select>
        <option value={paying} onChange={(e) => setPaying(e.target.value)}>
          You
        </option>
        <option value={"friend"}>{friend.name}</option>
      </select>

      <Button>Add</Button>
    </form>
  );
}
