using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MainSceneManager : MonoBehaviour
{
    private static MainSceneManager _singleton;
    public static MainSceneManager Singleton
    {
        get => _singleton;
        private set
        {
            if (_singleton == null)
                _singleton = value;
            else if (_singleton != value)
            {
                Debug.Log($"{nameof(MainSceneManager)} instance already exists, destroying duplicate!");
                Destroy(value);
            }
        }
    }

    private void Awake()
    {
        Singleton = this;
    }

    [SerializeField] private GameObject HomePage;
    [SerializeField] private GameObject MenuCategoryPage;
    [SerializeField] private GameObject MenuPage;
    [SerializeField] private GameObject MenuItemPage;
    [SerializeField] private GameObject OrderPage;
    [SerializeField] private GameObject MyOrdersPage;

    private void ShowPage(GameObject pageToShow)
    {
        HomePage.SetActive(false);
        MenuCategoryPage.SetActive(false);
        MenuPage.SetActive(false);
        MenuItemPage.SetActive(false);
        OrderPage.SetActive(false);
        MyOrdersPage.SetActive(false);

        pageToShow.SetActive(true);
    }

    public void OnClick_ShowHomePage()
    {
        ShowPage(HomePage);
    }

    public void OnClick_ShowMenuCategoryPage()
    {
        ShowPage(MenuCategoryPage);
    }

    public void OnClick_ShowMenuPage(string categoryName)
    {
        ShowPage(MenuPage);
    }
    public void OnClick_ShowMenuPageWithUpdate(string categoryName)
    {
        ShowPage(MenuPage);
        MenuPage.GetComponent<MenuManagerScript>().GetMenuList(categoryName);
    }

    public void ShowMenuItemPage(string itemName, string categoryName)
    {
        ShowPage(MenuItemPage);
        MenuItemPage.GetComponent<MenuItemPageManager>().ShowItem(itemName, categoryName);
    }

    public void OnClick_ShowOrderPage()
    {
        ShowPage(OrderPage);
    }

    public void OnClick_ShowMyOrdersPage()
    {
        ShowPage(MyOrdersPage);
    }
}
