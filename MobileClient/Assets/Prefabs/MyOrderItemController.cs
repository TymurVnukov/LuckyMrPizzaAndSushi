using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using static UnityEditor.Progress;

public class MyOrderItemController : MonoBehaviour
{
    public TMP_Text NameText;
    public TMP_Text PhoneNumberText;
    public TMP_Text CityText;
    public TMP_Text AddressText;
    public TMP_Text PaymentMethodText;
    public TMP_Text DateText;
    public TMP_Text StatusText;

    public GameObject OrderItemPrefab;
    public Transform OrdersContainer;

    public void SetData(UserInfo userInfo, ProductInfo[] productInfo)
    {
        NameText.text = $"Name: {userInfo.name}";
        PhoneNumberText.text = $"Phone number: {userInfo.phoneNumber}";
        CityText.text = $"City: {userInfo.city}";
        AddressText.text = $"Address: {userInfo.address}";
        PaymentMethodText.text = $"Payment method: {userInfo.paymentMethod}";
        DateText.text = $"Date: {userInfo.date}";
        StatusText.text = $"Status: {userInfo.statusName}";

        foreach (ProductInfo product in productInfo)
        {
            if (product.orderId == userInfo.id)
            {
                GameObject newOrderItem = Instantiate(OrderItemPrefab, OrdersContainer);
                MyOrderItemBlockController menuItemController = newOrderItem.GetComponent<MyOrderItemBlockController>();
                StartCoroutine(ComunicationController.LoadImage(product.imagePath, (loadedSprite) =>
                {
                    menuItemController.SetData(loadedSprite, product);
                }));
            }
        }
    }
}
