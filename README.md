# 馬上購電商網站後端伺服器

馬上購網站採前後端分離，本後端伺服器使用 node.js 環境 + Express + mySQL 建立而成。
若需查看前端 GitHub 請前往[網址](https://github.com/surferintaiwan/masungo-frontend)

## 測試帳號

-   管理員 帳號:root@example.com 密碼:12345678
-   一般使用者 帳號:user1@example.com 密碼:12345678
-   一般使用者 帳號:user1@example.com 密碼:12345678

## 功能說明

### Completed

1. 前台
    - 商品分類頁
    - 商品詳細頁
    - 商品加入購物車
    - 商品加入追蹤
    - 購物車頁
    - 完成付款頁
    - 訂單付款頁
    - 訂單完成付款頁
2. 後台
    - 商品管理(瀏覽/新增/編輯商品)
    - 訂單管理(瀏覽訂單/變更訂單狀態為已出貨)
    - 會員管理(瀏覽會員)
    - 商品分類管理(瀏覽/新增/編輯/刪除 三層分類)
    - 品牌管理(瀏覽/新增/編輯/刪除品牌)

### In Process

1. 顯示瀏覽過甚麼商品
2. 訂閱電子報
3. 開放後台上傳首頁廣告 Banner
4. 優惠券(可以輸入優惠碼使用，或透過後台統一發送至顧客帳戶)
5. 註冊 email 驗證
6. 後台可設定 GTM 貨 GA code

## 開始使用

1. 下載本專案檔案至本地端

```
git clone https://github.com/surferintaiwan/masungo-backend.git
```

2. 於終端機打開專案檔案

```
cd masungo-backend
```

3. 於終端機安裝 npm

此命令會查詢 package.json 看本專案使用了哪些套件，並自動安裝

```
npm install
```

4. 建立資料庫資料表

```
npx sequelize db:migrate
```

5. 建立種子資料

```
npx sequelize db:seed:all
```

6. 於終端機啟用並監聽伺服器

```
npm run dev
```

7. 若欲停止伺服器運行，可於終端機輸入 Ctrl + C ，即可停用伺服器

## 環境配置

### Web Server

-   node.js > v12.12.0

### DB

-   mySQL

### 框架

-   express

### 套件

-   待填

## 專案貢獻者

[Shawn](https://github.com/surferintaiwan)
