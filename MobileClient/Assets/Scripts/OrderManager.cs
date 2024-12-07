using System;
using System.Collections.Generic;
using UnityEngine;

public class OrderManager : MonoBehaviour
{
    private static OrderManager _singleton;
    public static OrderManager Singleton
    {
        get => _singleton;
        private set
        {
            if (_singleton == null)
                _singleton = value;
            else if (_singleton != value)
            {
                Debug.Log($"{nameof(OrderManager)} instance already exists, destroying duplicate!");
                Destroy(value);
            }
        }
    }

    public List<OrderItem> OrderList { get; private set; } = new List<OrderItem>();

    private void Awake()
    {
        Singleton = this;
        DontDestroyOnLoad(gameObject);

        //ClearOrderList();
        LoadOrderList();
    }

    private void LoadOrderList()
    {
        if (PlayerPrefs.HasKey("OrderList"))
        {
            string json = PlayerPrefs.GetString("OrderList");
            OrderList = JsonUtility.FromJson<OrderListWrapper>(json).orders;
        }
        
    }

    private void SaveOrderList()
    {
        var wrapper = new OrderListWrapper { orders = OrderList };
        string json = JsonUtility.ToJson(wrapper);
        PlayerPrefs.SetString("OrderList", json);
    }

    public void AddToCart(OrderItem item)
    {
        var existingItem = OrderList.Find(orderItem => orderItem.id == item.id);
        if (existingItem != null)
        {
            existingItem.quantity += 1;
        }
        else
        {
            OrderList.Add(new OrderItem { id = item.id, imagePath = item.imagePath, name = item.name, description = item.description, price = item.price, quantity = 1 });
        }
        SaveOrderList();
    }

    public int UpdateQuantity(OrderItem item, int delta)
    {
        var targetItem = OrderList.Find(order => order.id == item.id);
        if (targetItem != null)
        {
            targetItem.quantity += delta;
            if (targetItem.quantity <= 0)
            {
                OrderList.Remove(targetItem);
                SaveOrderList();
                return 0;
            }
            SaveOrderList();
            return targetItem.quantity;
        }
        return -1;
    }

    public void RemoveFromCart(OrderItem item)
    {
        var targetItem = OrderList.Find(order => order.id == item.id);
        Debug.Log(targetItem);
        if (OrderList.Remove(targetItem))
        {
            SaveOrderList();
        }
    }

    public void ClearOrderList()
    {
        OrderList.Clear();
        PlayerPrefs.DeleteKey("OrderList");
    }
}

[System.Serializable]
public class OrderItem
{
    public int id;
    public string imagePath;
    public string name;
    public string description;
    public double price;
    public int quantity;
}

[System.Serializable]
public class OrderListWrapper
{
    public List<OrderItem> orders;
}
