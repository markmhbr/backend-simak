<?php
try {
    $pdo = new PDO("mysql:host=127.0.0.1;dbname=simak;charset=utf8mb4", "markmhbr", "markmhbr123");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Exporting gtks...\n";
    $stmt = $pdo->query("SELECT * FROM gtks");
    $gtks = $stmt->fetchAll(PDO::FETCH_ASSOC);
    file_put_contents(__DIR__ . '/gtks.json', json_encode($gtks, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    echo "Exported " . count($gtks) . " gtks to gtks.json\n";

    echo "Exporting siswas...\n";
    $stmt = $pdo->query("SELECT * FROM siswas");
    $siswas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    file_put_contents(__DIR__ . '/siswas.json', json_encode($siswas, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    echo "Exported " . count($siswas) . " siswas to siswas.json\n";

    echo "Exporting sekolahs...\n";
    $stmt = $pdo->query("SELECT * FROM sekolahs");
    $sekolahs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    file_put_contents(__DIR__ . '/sekolahs.json', json_encode($sekolahs, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    echo "Exported " . count($sekolahs) . " sekolahs to sekolahs.json\n";

    echo "Done!\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
