using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using static OrderPageManager;

public class MyOrdersPageManager : MonoBehaviour
{
    public GameObject OrderItemPrefab;
    public Transform OrderContainer;
    private void OnEnable()
    {
        foreach (Transform child in OrderContainer.transform)
        {
            GameObject.Destroy(child.gameObject);
        }
        var data = new{ };
        StartCoroutine(ComunicationController.SendToServer("GET", data, $"myorders", (responseJson) => OnGetMyordersResponse(responseJson), (responseJson) => OnGetMyordersResponseError(responseJson)));
    }

    private void OnGetMyordersResponse(string responseJson)
    {
        UserOrders responseData = JsonConvert.DeserializeObject<UserOrders>(responseJson);
        if (responseData.userOrders != null)
        {
            foreach (var userInfo in responseData.userOrders.info)
            {
                GameObject newOrderItem = Instantiate(OrderItemPrefab, OrderContainer);
                MyOrderItemController menuItemController = newOrderItem.GetComponent<MyOrderItemController>();
                menuItemController.SetData(userInfo, responseData.userOrders.order);
            }
        }
        else
        {
            Debug.LogError("userOrders is null.");
        }
    }

    private void OnGetMyordersResponseError(string responseJson)
    {
        Debug.Log(responseJson);
        ErrorResponse responseData = JsonConvert.DeserializeObject<ErrorResponse>(responseJson);
    }
}

[System.Serializable]
public class UserInfo
{
    public int id { get; set; }
    public int userId { get; set; }
    public string name { get; set; }
    public string phoneNumber { get; set; }
    public string city { get; set; }
    public string address { get; set; }
    public string paymentMethod { get; set; }
    public string date { get; set; }
    public string statusName { get; set; }
}

[System.Serializable]
public class ProductInfo
{
    public int productId { get; set; }
    public int orderId { get; set; }
    public string name { get; set; }
    public string imagePath { get; set; }
    public double price { get; set; }
    public int quantity { get; set; }
}

[System.Serializable]
public class UserOrders
{
    public bool success { get; set; }
    public string message { get; set; }
    public UserOrderDetails userOrders { get; set; } // userOrders is an object, not an array
}

[System.Serializable]
public class UserOrderDetails
{
    public UserInfo[] info { get; set; } // info is an array
    public ProductInfo[] order { get; set; } // order is an array
}
