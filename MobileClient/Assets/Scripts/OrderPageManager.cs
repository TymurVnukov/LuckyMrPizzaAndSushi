using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class OrderPageManager : MonoBehaviour
{
    public GameObject OrderItemPrefab;
    public Transform OrderContainer;

    public TMP_InputField NameInput;
    public TMP_Text NameTextError;
    public TMP_InputField PhoneNumberInput;
    public TMP_Text PhoneNumberTextError;
    public TMP_InputField CityInput;
    public TMP_Text CityTextError;
    public TMP_InputField AddressInput;
    public TMP_Text AddressTextError;
    public TMP_Dropdown PaymentMethodDropdown;
    private string paymentMethod = "Credit Card";
    public GameObject SuccessOrderPlace;

    private void Start()
    {
        PaymentMethodDropdown.onValueChanged.AddListener(OnDropdownValueChanged);
    }

    private void OnEnable()
    {
        SuccessOrderPlace.SetActive(false);
        UpdateOrderList();
    }
    private void UpdateOrderList()
    {
        foreach (Transform child in OrderContainer.transform)
        {
            GameObject.Destroy(child.gameObject);
        }

        for (int i = 0; i < OrderManager.Singleton.OrderList.Count; i++)
        {
            OrderItem item = OrderManager.Singleton.OrderList[i];

            GameObject newMenuItem = Instantiate(OrderItemPrefab, OrderContainer);
            OrderItemController menuItemController = newMenuItem.GetComponent<OrderItemController>();

            StartCoroutine(ComunicationController.LoadImage(item.imagePath, (loadedSprite) =>
            {
                menuItemController.SetData(loadedSprite, 
                    new OrderItem {
                        id = item.id,
                        imagePath = item.imagePath,
                        name = item.name,
                        description = item.description,
                        price = item.price,
                        quantity = item.quantity
                    }
                );
            }));
        }
    }

    public void OnClick_PlaceOrder()
    {

        var _minimizedUserInfo = new
        {
            name = NameInput.text,
            phoneNumber = PhoneNumberInput.text,
            city = CityInput.text,
            address = AddressInput.text,
            paymentMethod = paymentMethod
        };

        var idOrderList = OrderManager.Singleton.OrderList.Select(item => new
        {
            id = item.id,
            count = item.quantity
        }).ToList();

        var data = new { 
            userInfo = _minimizedUserInfo, 
            idOrderList = idOrderList
        };
        StartCoroutine(ComunicationController.SendToServer("POST", data, $"checkout", (responseJson) => OnGetPlaceOrderResponse(responseJson), (responseJson) => OnGetPlaceOrderResponseError(responseJson)));
    }

    private void OnGetPlaceOrderResponse(string responseJson)
    {
        foreach (Transform child in OrderContainer.transform)
        {
            GameObject.Destroy(child.gameObject);
        }
        OrderManager.Singleton.ClearOrderList();
        NameTextError.enabled = false;
        PhoneNumberTextError.enabled = false;
        CityTextError.enabled = false;
        AddressTextError.enabled = false;
        SuccessOrderPlace.SetActive(true);
    }

    private void OnGetPlaceOrderResponseError(string responseJson)
    {
        ErrorResponse responseData = JsonConvert.DeserializeObject<ErrorResponse>(responseJson);

        if (responseData.ErrorData != null)
        {
            Debug.Log($"Error: {responseData.ErrorData.message}");
        }

        if (responseData.FieldErrors != null)
        {
            UpdateError(NameTextError, responseData.FieldErrors.Name);
            UpdateError(PhoneNumberTextError, responseData.FieldErrors.PhoneNumber);
            UpdateError(CityTextError, responseData.FieldErrors.City);
            UpdateError(AddressTextError, responseData.FieldErrors.Address);
        }

        void UpdateError(TMP_Text errorElement, string errorMessage)
        {
            if (string.IsNullOrEmpty(errorMessage))
            {
                errorElement.enabled = false;
            }
            else
            {
                errorElement.text = errorMessage;
                errorElement.enabled = true;
            }
        }
    }

    void OnDropdownValueChanged(int index)
    {
        paymentMethod = PaymentMethodDropdown.options[index].text;
    }

    public class ErrorResponse
    {
        public FieldErrors FieldErrors { get; set; }
        public ErrorData ErrorData { get; set; }
    }

    public class FieldErrors
    {
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
    }
}
