# Sanat Galerisi

Bu proje, yapay zeka destekli bir sanat galerisi uygulamasıdır.

## Projeyi İndirme ve Kurulum

Proje büyük model dosyaları içerdiği için parçalara bölünmüş bir bundle olarak dağıtılmaktadır. Kurulum için aşağıdaki adımları takip edin:

1. [Releases](https://github.com/MARABA157/sanat/releases/latest) sayfasından tüm bundle parçalarını indirin:
   - sanat-galerisi.bundle.part1
   - sanat-galerisi.bundle.part2
   - ...
   - sanat-galerisi.bundle.part12

2. Tüm parçaları aynı dizine indirdiğinizden emin olun

3. PowerShell'de parçaları birleştirin:
   ```powershell
   # Parçaları birleştirme
   Get-Content sanat-galerisi.bundle.part* -Raw | Set-Content sanat-galerisi.bundle
   ```

4. Bundle'dan projeyi çıkarın:
   ```bash
   # Yeni bir dizin oluşturun
   mkdir sanat-galerisi
   cd sanat-galerisi
   
   # Bundle'ı klonlayın
   git clone sanat-galerisi.bundle .
   ```

5. Projeyi başlatın:
   ```bash
   npm install
   npm run dev
   ```

## Not:
- Tüm parçaları indirdiğinizden emin olun
- Parçaları sırasıyla birleştirmek önemlidir
- Herhangi bir sorun yaşarsanız Issues bölümünden bildirebilirsiniz

## Test
Bu satır GitHub senkronizasyonunu test etmek için eklenmiştir.
